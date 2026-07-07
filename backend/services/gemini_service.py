import google.generativeai as genai
from config import settings
from typing import Dict, List
import json
import re
import asyncio


class GeminiService:
    """Service for interacting with Gemini API"""
    
    def __init__(self):
        """Initialize Gemini clients"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Deep analysis — best quality
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        # Real-time comments — fastest model, lowest latency
        self.fast_model = genai.GenerativeModel('gemini-2.0-flash-lite')
    
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


    async def generate_line_comments(self, code: str, language: str = None) -> list:
        """
        Generate real-time per-line comments using gemini-2.0-flash-lite (fastest model)

        Returns:
            List of dicts with line, comment, type
        """
        lang_hint = f" The language is {language}." if language else ""
        prompt = f"""You are a real-time code assistant.{lang_hint}

Analyze the following code and produce per-line comments for the most important lines.
Focus on: function definitions, loops, conditions, return statements, assignments, potential bugs.

Code:
```
{code}
```

Respond ONLY with a valid JSON array (no extra text), format:
[
  {{"line": <line_number>, "comment": "<short explanation>", "type": "<info|important|warning>"}},
  ...
]

Rules:
- Maximum 15 comments
- type = "important" for function defs, returns, key logic
- type = "warning" for potential bugs, risky patterns
- type = "info" for loops, conditions, assignments
- Keep each comment under 80 characters
- Only comment lines that have real content (skip blank lines)"""

        try:
            # Use fast_model for lowest latency
            response = await asyncio.to_thread(self.fast_model.generate_content, prompt)
            response_text = response.text.strip()

            # Strip markdown code fences if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            result = json.loads(response_text.strip())
            if isinstance(result, list):
                return result
            return []
        except Exception as e:
            return []


# Create singleton instance
gemini_service = GeminiService()
