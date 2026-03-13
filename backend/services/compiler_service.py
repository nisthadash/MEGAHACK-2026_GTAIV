"""
Local Code Compilation and Execution Service

Executes code locally using system compilers/interpreters
Supports: Python, JavaScript (Node.js), Java, C++, C
"""

import subprocess
import tempfile
import os
import signal
from typing import Dict
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Timeout for code execution (seconds)
EXECUTION_TIMEOUT = 10

# Max output size (bytes)
MAX_OUTPUT_SIZE = 100000


class CompilerService:
    """Service for executing code locally"""
    
    @staticmethod
    async def execute_python(code: str) -> Dict:
        """Execute Python code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                file_path = f.name
            
            try:
                result = subprocess.run(
                    ['python', file_path],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                output = result.stdout[:MAX_OUTPUT_SIZE]
                stderr = result.stderr[:MAX_OUTPUT_SIZE]
                
                return {
                    "output": output,
                    "stderr": stderr,
                    "exit_code": result.returncode,
                    "status": "success" if result.returncode == 0 else "error"
                }
            finally:
                os.unlink(file_path)
        
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "stderr": f"Execution timeout exceeded ({EXECUTION_TIMEOUT}s)",
                "exit_code": -1,
                "status": "timeout"
            }
        except Exception as e:
            return {
                "output": "",
                "stderr": f"Execution error: {str(e)}",
                "exit_code": -1,
                "status": "error"
            }
    
    @staticmethod
    async def execute_javascript(code: str) -> Dict:
        """Execute JavaScript code using Node.js"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                file_path = f.name
            
            try:
                result = subprocess.run(
                    ['node', file_path],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                output = result.stdout[:MAX_OUTPUT_SIZE]
                stderr = result.stderr[:MAX_OUTPUT_SIZE]
                
                return {
                    "output": output,
                    "stderr": stderr,
                    "exit_code": result.returncode,
                    "status": "success" if result.returncode == 0 else "error"
                }
            finally:
                os.unlink(file_path)
        
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "stderr": f"Execution timeout exceeded ({EXECUTION_TIMEOUT}s)",
                "exit_code": -1,
                "status": "timeout"
            }
        except FileNotFoundError:
            return {
                "output": "",
                "stderr": "Node.js not installed or not in PATH",
                "exit_code": -1,
                "status": "error"
            }
        except Exception as e:
            return {
                "output": "",
                "stderr": f"Execution error: {str(e)}",
                "exit_code": -1,
                "status": "error"
            }
    
    @staticmethod
    async def execute_cpp(code: str) -> Dict:
        """Compile and execute C++ code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                source_file = os.path.join(tmpdir, 'program.cpp')
                executable = os.path.join(tmpdir, 'program.exe' if os.name == 'nt' else 'program')
                
                # Write source
                with open(source_file, 'w') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['g++', source_file, '-o', executable],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                if compile_result.returncode != 0:
                    return {
                        "output": "",
                        "stderr": f"Compilation error: {compile_result.stderr[:MAX_OUTPUT_SIZE]}",
                        "exit_code": compile_result.returncode,
                        "status": "compilation_error"
                    }
                
                # Execute
                result = subprocess.run(
                    [executable],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                output = result.stdout[:MAX_OUTPUT_SIZE]
                stderr = result.stderr[:MAX_OUTPUT_SIZE]
                
                return {
                    "output": output,
                    "stderr": stderr,
                    "exit_code": result.returncode,
                    "status": "success" if result.returncode == 0 else "error"
                }
        
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "stderr": f"Execution timeout exceeded ({EXECUTION_TIMEOUT}s)",
                "exit_code": -1,
                "status": "timeout"
            }
        except FileNotFoundError:
            return {
                "output": "",
                "stderr": "G++ compiler not found. Ensure G++ is installed and in PATH.",
                "exit_code": -1,
                "status": "error"
            }
        except Exception as e:
            return {
                "output": "",
                "stderr": f"Error: {str(e)}",
                "exit_code": -1,
                "status": "error"
            }
    
    @staticmethod
    async def execute_c(code: str) -> Dict:
        """Compile and execute C code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                source_file = os.path.join(tmpdir, 'program.c')
                executable = os.path.join(tmpdir, 'program.exe' if os.name == 'nt' else 'program')
                
                # Write source
                with open(source_file, 'w') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['gcc', source_file, '-o', executable],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                if compile_result.returncode != 0:
                    return {
                        "output": "",
                        "stderr": f"Compilation error: {compile_result.stderr[:MAX_OUTPUT_SIZE]}",
                        "exit_code": compile_result.returncode,
                        "status": "compilation_error"
                    }
                
                # Execute
                result = subprocess.run(
                    [executable],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                output = result.stdout[:MAX_OUTPUT_SIZE]
                stderr = result.stderr[:MAX_OUTPUT_SIZE]
                
                return {
                    "output": output,
                    "stderr": stderr,
                    "exit_code": result.returncode,
                    "status": "success" if result.returncode == 0 else "error"
                }
        
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "stderr": f"Execution timeout exceeded ({EXECUTION_TIMEOUT}s)",
                "exit_code": -1,
                "status": "timeout"
            }
        except FileNotFoundError:
            return {
                "output": "",
                "stderr": "GCC compiler not found. Ensure GCC is installed and in PATH.",
                "exit_code": -1,
                "status": "error"
            }
        except Exception as e:
            return {
                "output": "",
                "stderr": f"Error: {str(e)}",
                "exit_code": -1,
                "status": "error"
            }
    
    @staticmethod
    async def execute_java(code: str) -> Dict:
        """Compile and execute Java code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                # Extract class name from code
                import re
                match = re.search(r'class\s+(\w+)', code)
                class_name = match.group(1) if match else "Main"
                
                source_file = os.path.join(tmpdir, f'{class_name}.java')
                
                # Write source
                with open(source_file, 'w') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['javac', source_file],
                    capture_output=True,
                    text=True,
                    cwd=tmpdir,
                    timeout=EXECUTION_TIMEOUT
                )
                
                if compile_result.returncode != 0:
                    return {
                        "output": "",
                        "stderr": f"Compilation error: {compile_result.stderr[:MAX_OUTPUT_SIZE]}",
                        "exit_code": compile_result.returncode,
                        "status": "compilation_error"
                    }
                
                # Execute
                result = subprocess.run(
                    ['java', '-cp', tmpdir, class_name],
                    capture_output=True,
                    text=True,
                    timeout=EXECUTION_TIMEOUT
                )
                
                output = result.stdout[:MAX_OUTPUT_SIZE]
                stderr = result.stderr[:MAX_OUTPUT_SIZE]
                
                return {
                    "output": output,
                    "stderr": stderr,
                    "exit_code": result.returncode,
                    "status": "success" if result.returncode == 0 else "error"
                }
        
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "stderr": f"Execution timeout exceeded ({EXECUTION_TIMEOUT}s)",
                "exit_code": -1,
                "status": "timeout"
            }
        except FileNotFoundError:
            return {
                "output": "",
                "stderr": "Java compiler not found. Ensure JDK is installed and in PATH.",
                "exit_code": -1,
                "status": "error"
            }
        except Exception as e:
            return {
                "output": "",
                "stderr": f"Error: {str(e)}",
                "exit_code": -1,
                "status": "error"
            }
    
    @staticmethod
    async def execute_code(code: str, language: str) -> Dict:
        """
        Execute code based on language
        
        Args:
            code: Source code to execute
            language: Programming language (python, javascript, java, cpp, c)
        
        Returns:
            Dict with output, stderr, status, and exit_code
        """
        language = language.lower().strip()
        
        if language == 'python':
            return await CompilerService.execute_python(code)
        elif language in ['javascript', 'js', 'node']:
            return await CompilerService.execute_javascript(code)
        elif language == 'cpp':
            return await CompilerService.execute_cpp(code)
        elif language == 'c':
            return await CompilerService.execute_c(code)
        elif language == 'java':
            return await CompilerService.execute_java(code)
        else:
            return {
                "output": "",
                "stderr": f"Unsupported language: {language}",
                "exit_code": -1,
                "status": "error"
            }


# Create singleton instance
compiler_service = CompilerService()
