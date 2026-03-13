import google.generativeai as genai
from config import settings
from typing import Dict, List
import json
import re
import asyncio


class GeminiService:
    """Service for interacting with Gemini API"""
    
    def __init__(self):
        """Initialize Gemini client"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Use gemini-2.5-flash for optimal speed and cost
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def explain_code(self, code: str) -> Dict:
        """
        Explain code using Gemini API
        
        Returns:
            Dict with summary, explanation, bugs, assumptions, optimization
        """
        prompt = f"""Analyze the following code and provide detailed explanations in JSON format:

```
{code}
```

Please provide a response in the following JSON format (ensure valid JSON):
{{
    "summary": "Brief one-line summary of what this code does",
    "explanation": "Detailed line-by-line explanation of the code logic",
    "bugs": ["List of potential bugs or issues"],
    "assumptions": ["List of assumptions the code makes"],
    "optimization": ["List of optimization suggestions"]
}}

Respond with ONLY the JSON object, no additional text."""

        try:
            # Use asyncio.to_thread to run sync API call
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            response_text = response.text.strip()
            
            # Parse JSON response
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json\n", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```\n", "").replace("```", "").strip()
            
            result = json.loads(response_text)
            return result
        except Exception as e:
            return {
                "summary": "Error analyzing code",
                "explanation": str(e),
                "bugs": [],
                "assumptions": [],
                "optimization": []
            }
    
    async def get_mentor_response(self, message: str, code: str = None) -> str:
        """
        Get AI mentor response for a question
        
        Args:
            message: User's question or message
            code: Optional code context
        
        Returns:
            String response from AI mentor
        """
        context = ""
        if code:
            context = f"\nHere's the code we're discussing:\n```\n{code}\n```\n"
        
        prompt = f"""You are an experienced programming mentor helping a developer learn and improve their code.

{context}

Student's question: {message}

Provide a helpful, concise response (max 500 characters) that:
1. Directly answers their question
2. Provides learning opportunities
3. Suggests best practices when relevant"""

        try:
            # Use asyncio.to_thread to run sync API call
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            return response.text
        except Exception as e:
            return f"Error getting response: {str(e)}"
    
    async def analyze_code_quality(self, code: str) -> Dict:
        """
        Analyze code quality metrics
        
        Returns:
            Dict with quality assessment
        """
        prompt = f"""Analyze code quality for the following code and provide metrics in JSON format:

```
{code}
```

Provide response as JSON (valid JSON only):
{{
    "quality_score": <number 0-100>,
    "readability": <number 0-100>,
    "maintainability": <number 0-100>,
    "security_issues": ["list of security concerns"],
    "performance_issues": ["list of performance concerns"],
    "suggestions": ["improvement suggestions"]
}}

Respond with ONLY the JSON object."""

        try:
            # Use asyncio.to_thread to run sync API call
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            response_text = response.text.strip()
            
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json\n", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```\n", "").replace("```", "").strip()
            
            result = json.loads(response_text)
            return result
        except Exception as e:
            return {
                "quality_score": 50,
                "readability": 50,
                "maintainability": 50,
                "security_issues": [],
                "performance_issues": [],
                "suggestions": [str(e)]
            }


# Create singleton instance
gemini_service = GeminiService()
