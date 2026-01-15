import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change working directory to backend/src
src_path = os.path.join(backend_path, 'src')
os.chdir(src_path)

# Add src to the path as well
sys.path.insert(0, src_path)

# Now import and run the app
from main import app
import uvicorn

if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)