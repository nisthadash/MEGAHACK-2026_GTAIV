import ast
import re
from typing import Dict
from utils.language_detector import detect_language


class AnalysisService:
    """Service for analyzing code metrics"""
    
    @staticmethod
    def analyze_python_code(code: str) -> Dict:
        """Analyze Python code for metrics"""
        try:
            tree = ast.parse(code)
            
            functions = len([node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)])
            classes = len([node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)])
            loops = len([node for node in ast.walk(tree) if isinstance(node, (ast.For, ast.While))])
            conditions = len([node for node in ast.walk(tree) if isinstance(node, ast.If)])
            recursions = AnalysisService._count_recursions(tree)
            
            lines = len(code.split('\n'))
            complexity = AnalysisService._calculate_complexity(functions, loops, conditions, recursions)
            
            return {
                "total_lines": lines,
                "functions": functions,
                "classes": classes,
                "loops": loops,
                "conditions": conditions,
                "recursions": recursions,
                "complexity_score": complexity,
                "metrics": {
                    "functions_per_100_lines": round((functions / max(lines, 1)) * 100, 2),
                    "conditions_per_100_lines": round((conditions / max(lines, 1)) * 100, 2)
                }
            }
        except SyntaxError as e:
            return {
                "error": f"Syntax error: {str(e)}",
                "total_lines": len(code.split('\n')),
                "functions": 0,
                "classes": 0,
                "loops": 0,
                "conditions": 0,
                "recursions": 0,
                "complexity_score": 0
            }
    
    @staticmethod
    def analyze_generic_code(code: str, language: str) -> Dict:
        """Analyze non-Python code for metrics using regex"""
        lines = code.split('\n')
        total_lines = len(lines)
        
        # Function pattern - language agnostic
        functions = len(re.findall(r'(function|def|void|int|public|private)\s+\w+\s*[\(\{]', code))
        
        # Loop detection
        loops = len(re.findall(r'\b(for|while)\b', code))
        
        # Conditional detection
        conditions = len(re.findall(r'\b(if|else if|switch)\b', code))
        
        # Class detection
        classes = len(re.findall(r'\bclass\s+\w+', code))
        
        # Calculate cyclomatic complexity
        complexity = AnalysisService._calculate_complexity(functions, loops, conditions, 0)
        
        return {
            "total_lines": total_lines,
            "functions": functions,
            "classes": classes,
            "loops": loops,
            "conditions": conditions,
            "recursions": 0,
            "complexity_score": complexity,
            "language": language,
            "metrics": {
                "functions_per_100_lines": round((functions / max(total_lines, 1)) * 100, 2),
                "conditions_per_100_lines": round((conditions / max(total_lines, 1)) * 100, 2)
            }
        }
    
    @staticmethod
    def analyze_code(code: str) -> Dict:
        """
        Analyze code and return metrics
        
        Returns comprehensive code analysis including:
        - Line count
        - Functions
        - Classes
        - Loops
        - Conditions
        - Complexity score
        - Quality score
        """
        language = detect_language(code)
        
        if language == "python":
            basic_metrics = AnalysisService.analyze_python_code(code)
        else:
            basic_metrics = AnalysisService.analyze_generic_code(code, language)
        
        # Calculate quality score (0-100)
        quality_score = AnalysisService._calculate_quality_score(code, basic_metrics, language)
        
        basic_metrics["quality_score"] = quality_score
        basic_metrics["language_detected"] = language
        
        return basic_metrics
    
    @staticmethod
    def _count_recursions(tree) -> int:
        """Count recursive function calls in Python AST"""
        recursions = 0
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                for subnode in ast.walk(node):
                    if isinstance(subnode, ast.Call):
                        if isinstance(subnode.func, ast.Name):
                            if subnode.func.id == node.name:
                                recursions += 1
        
        return recursions
    
    @staticmethod
    def _calculate_complexity(functions: int, loops: int, conditions: int, recursions: int) -> float:
        """Calculate cyclomatic complexity"""
        # Base complexity is 1
        complexity = 1
        
        # Add complexity for each decision point
        complexity += conditions * 1
        complexity += loops * 1
        complexity += recursions * 2  # Recursion adds extra complexity
        
        # Normalize to 0-100 scale
        normalized = min(100, (complexity / 20) * 100)
        
        return round(normalized, 2)
    
    @staticmethod
    def _calculate_quality_score(code: str, metrics: Dict, language: str) -> float:
        """
        Calculate code quality score (0-100)
        Based on:
        - Complexity
        - Line length
        - Documentation
        - Function size
        """
        score = 100
        lines = code.split('\n')
        
        # Penalize excessive complexity
        if metrics.get("complexity_score", 0) > 50:
            score -= min(20, (metrics.get("complexity_score", 0) - 50) / 2.5)
        
        # Penalize long lines
        long_lines = sum(1 for line in lines if len(line) > 100)
        if long_lines > 0:
            score -= min(10, (long_lines / len(lines)) * 100 / 10)
        
        # Reward documentation/comments
        comment_lines = len([l for l in lines if l.strip().startswith(('#', '//', '/*', '*'))])
        if len(lines) > 0 and comment_lines > 0:
            comment_ratio = comment_lines / len(lines)
            if comment_ratio > 0.1:  # More than 10% comments
                score = min(100, score + 5)
        
        # Penalize very long functions (heuristic)
        avg_lines_per_function = len(lines) / max(metrics.get("functions", 1), 1)
        if avg_lines_per_function > 50:
            score -= min(15, (avg_lines_per_function - 50) / 10)
        
        return max(0, round(score, 2))


# Create analysis service instance
analysis_service = AnalysisService()
