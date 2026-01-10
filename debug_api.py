import requests
import json

# Test the API endpoints directly
base_url = "http://127.0.0.1:8000"

# Start the server in another terminal first with: uvicorn backend.src.main:app --reload
try:
    # Test health check
    response = requests.get(f"{base_url}/health")
    print(f"Health check: {response.status_code}, {response.json()}")

    # Test API routes
    response = requests.get(f"{base_url}/api/v1/tasks")
    print(f"GET /api/v1/tasks: {response.status_code}")

    # Try without the /api/v1 prefix (maybe the router prefix is causing issues)
    response = requests.get(f"{base_url}/tasks")
    print(f"GET /tasks: {response.status_code}")

    # Check available routes
    response = requests.get(f"{base_url}/docs")
    print(f"Docs available: {response.status_code}")

except Exception as e:
    print(f"Error: {e}")
    print("Make sure the server is running with: uvicorn backend.src.main:app --reload")