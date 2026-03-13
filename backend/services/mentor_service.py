from services.gemini_service import gemini_service
from services.analysis_service import analysis_service
from typing import Dict, Optional


class MentorService:
    """Service for AI mentor functionality"""
    
    @staticmethod
    async def generate_code_explanation(code: str) -> Dict:
        """
        Generate comprehensive code explanation
        
        Returns:
            Dict with summary, explanation, bugs, assumptions, optimization
        """
        explanation = await gemini_service.explain_code(code)
        
        # Enhance with static analysis
        analysis = analysis_service.analyze_code(code)
        
        return {
            **explanation,
            "metrics": {
                "complexity": analysis.get("complexity_score"),
                "quality": analysis.get("quality_score"),
                "functions": analysis.get("functions"),
                "lines": analysis.get("total_lines")
            }
        }
    
    @staticmethod
    async def get_mentor_response(message: str, code: Optional[str] = None) -> str:
        """
        Get AI mentor response to user query
        
        Args:
            message: User's question or request
            code: Optional code context
        
        Returns:
            String response from AI mentor
        """
        return await gemini_service.get_mentor_response(message, code)
    
    @staticmethod
    async def analyze_code_quality(code: str) -> Dict:
        """
        Analyze code quality using Gemini
        
        Returns:
            Dict with quality metrics and suggestions
        """
        # Get Gemini analysis
        gemini_analysis = await gemini_service.analyze_code_quality(code)
        
        # Get static analysis
        static_analysis = analysis_service.analyze_code(code)
        
        # Combine results
        return {
            "gemini_analysis": gemini_analysis,
            "static_analysis": {
                "complexity_score": static_analysis.get("complexity_score"),
                "lines_of_code": static_analysis.get("total_lines"),
                "functions": static_analysis.get("functions"),
                "quality_score": static_analysis.get("quality_score")
            }
        }
    
    @staticmethod
    def get_optimization_suggestions(code: str) -> Dict:
        """
        Get optimization suggestions based on code analysis
        
        Returns:
            Dict with performance and maintainability suggestions
        """
        analysis = analysis_service.analyze_code(code)
        
        suggestions = []
        
        # Complexity suggestions
        if analysis.get("complexity_score", 0) > 70:
            suggestions.append("Code complexity is high. Consider breaking into smaller functions.")
        
        # Function size suggestions
        if analysis.get("functions", 0) > 0:
            avg_lines = analysis.get("total_lines", 0) / analysis.get("functions", 1)
            if avg_lines > 50:
                suggestions.append("Average function size is large. Consider refactoring into smaller units.")
        
        # Loop suggestions
        if analysis.get("loops", 0) > 5:
            suggestions.append("Code has many loops. Consider using built-in functions or list comprehensions.")
        
        # Condition suggestions
        if analysis.get("conditions", 0) > 10:
            suggestions.append("Multiple conditions detected. Consider using switch/case or polymorphism.")
        
        return {
            "analysis": analysis,
            "suggestions": suggestions,
            "priority": "high" if len(suggestions) > 3 else "medium" if len(suggestions) > 0 else "low"
        }


# Create mentor service instance
mentor_service = MentorService()
