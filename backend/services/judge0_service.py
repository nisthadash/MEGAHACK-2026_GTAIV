import httpx
import time
from config import settings
from typing import Dict, Optional
from utils.language_detector import get_language_judge0_id


class Judge0Service:
    """Service for interacting with Judge0 API for code execution"""
    
    def __init__(self):
        self.base_url = settings.JUDGE0_BASE_URL
        self.api_key = settings.JUDGE0_API_KEY
        self.headers = {
            "x-rapidapi-key": self.api_key,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        }
    
    async def execute_code(self, code: str, language: str, stdin: str = "") -> Dict:
        """
        Execute code using Judge0 API
        
        Args:
            code: Source code to execute
            language: Programming language (python, javascript, java, cpp, c)
            stdin: Standard input for the program
        
        Returns:
            Dict with output, stderr, status, exit_code, execution_time
        """
        try:
            language_id = get_language_judge0_id(language)
            
            # Submit code for execution
            submit_payload = {
                "source_code": code,
                "language_id": language_id,
                "stdin": stdin,
                "cpu_time_limit": 5,
                "memory_limit": 128000,
            }
            
            # Submit execution request
            async with httpx.AsyncClient() as client:
                submit_response = await client.post(
                    f"{self.base_url}/submissions?base64_encoded=false&wait=false",
                    json=submit_payload,
                    headers=self.headers,
                    timeout=10
                )
            
            if submit_response.status_code != 201:
                return {
                    "output": None,
                    "stderr": f"Submission failed: {submit_response.text}",
                    "status": "error",
                    "exit_code": -1,
                    "execution_time": 0
                }
            
            submission_id = submit_response.json()["token"]
            
            # Poll for execution result (max 30 seconds)
            max_attempts = 60
            attempt = 0
            
            while attempt < max_attempts:
                time.sleep(0.5)  # Wait before polling
                
                async with httpx.AsyncClient() as client:
                    result_response = await client.get(
                        f"{self.base_url}/submissions/{submission_id}?base64_encoded=false",
                        headers=self.headers,
                        timeout=10
                    )
                
                if result_response.status_code == 200:
                    result = result_response.json()
                    
                    if result["status"]["id"] not in [1, 2]:  # Not queued or running
                        return self._format_result(result)
                
                attempt += 1
            
            return {
                "output": None,
                "stderr": "Execution timeout",
                "status": "timeout",
                "exit_code": -1,
                "execution_time": 30
            }
        
        except Exception as e:
            return {
                "output": None,
                "stderr": str(e),
                "status": "error",
                "exit_code": -1,
                "execution_time": 0
            }
    
    def _format_result(self, result: Dict) -> Dict:
        """Format Judge0 result to our response format"""
        status_map = {
            3: "accepted",
            4: "wrong_answer",
            5: "time_limit_exceeded",
            6: "compilation_error",
            7: "runtime_error",
            8: "system_error",
            13: "internal_error"
        }
        
        status_id = result["status"]["id"]
        status = status_map.get(status_id, "unknown")
        
        output = result.get("stdout", "") or ""
        stderr = result.get("stderr", "") or ""
        
        # Combine compilation error into stderr if exists
        if result.get("compile_output"):
            stderr = result.get("compile_output")
        
        return {
            "output": output if output else None,
            "stderr": stderr if stderr else None,
            "status": status,
            "exit_code": result.get("exit_code", 0),
            "execution_time": float(result.get("time", 0) or 0)
        }


# Create singleton instance
judge0_service = Judge0Service()
