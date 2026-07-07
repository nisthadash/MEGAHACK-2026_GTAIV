import sys
import os

# Add the backend directory to Python path so all backend modules are importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app - Vercel automatically serves the 'app' ASGI object
from main import app
