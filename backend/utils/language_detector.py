import re


def detect_language(code: str) -> str:
    """
    Detect programming language from code content
    
    Returns: language name (python, javascript, java, cpp, c)
    """
    code_lower = code.lower()
    code_stripped = code.strip()
    
    # Python detection
    if (re.search(r'\bdef\s+\w+\(', code) or 
        re.search(r'\bprint\s*\(', code) or
        re.search(r'\bimport\s+\w+', code) or
        re.search(r'\bfrom\s+\w+\s+import', code) or
        re.search(r'\bclass\s+\w+.*:', code)):
        return "python"
    
    # JavaScript detection
    if (re.search(r'\bfunction\s+\w+\s*\(', code) or
        re.search(r'\bconst\s+\w+\s*=', code) or
        re.search(r'\blet\s+\w+\s*=', code) or
        re.search(r'\bvar\s+\w+\s*=', code) or
        re.search(r'\bconsole\.log\s*\(', code) or
        re.search(r'\brequire\s*\(', code)):
        return "javascript"
    
    # Java detection
    if (re.search(r'\bpublic\s+class\s+\w+', code) or
        re.search(r'\bpublic\s+static\s+void\s+main', code) or
        re.search(r'\bSystem\.out\.println', code)):
        return "java"
    
    # C++ detection
    if (re.search(r'#include\s*<', code) or
        re.search(r'\bstd::', code) or
        re.search(r'\busing\s+namespace\s+std', code)):
        return "cpp"
    
    # C detection
    if (re.search(r'#include\s*"', code) or
        re.search(r'\bvoid\s+main\s*\(', code) or
        re.search(r'\bprintf\s*\(', code)):
        return "c"
    
    # Default to python
    return "python"


def get_language_judge0_id(language: str) -> int:
    """Get Judge0 language ID for given language"""
    language_map = {
        "python": 71,
        "javascript": 63,
        "java": 62,
        "cpp": 53,
        "c": 50
    }
    return language_map.get(language, 71)  # Default to Python
