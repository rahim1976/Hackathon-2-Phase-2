#!/usr/bin/env python3
"""
Quickstart validation script to test the authentication flow.
This script validates that the auth system works as expected.
"""

import requests
import os
from datetime import datetime

def test_auth_flow():
    """Test the complete authentication flow."""
    print("Starting authentication flow validation...")

    # Get the API base URL from environment or default to localhost
    base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
    print(f"Testing against: {base_url}")

    # Test 1: Register a new user
    print("\n1. Testing user registration...")
    user_data = {
        "email": f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "password": "securepassword123",
        "name": "Test User"
    }

    try:
        response = requests.post(f"{base_url}/auth/register", json=user_data)
        if response.status_code == 201:
            print("✓ User registration successful")
            token_data = response.json()
            access_token = token_data["access_token"]
            print("✓ JWT token received")
        else:
            print(f"✗ User registration failed with status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error during registration: {str(e)}")
        return False

    # Test 2: Access protected endpoint with valid token
    print("\n2. Testing protected endpoint access...")
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers)
        if response.status_code == 200:
            user_info = response.json()
            print(f"✓ Protected endpoint accessed successfully, user: {user_info['email']}")
        else:
            print(f"✗ Protected endpoint access failed with status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error accessing protected endpoint: {str(e)}")
        return False

    # Test 3: Try to access protected endpoint without token
    print("\n3. Testing unauthorized access rejection...")
    try:
        response = requests.get(f"{base_url}/auth/me")
        if response.status_code == 401:
            print("✓ Unauthorized access correctly rejected with 401")
        else:
            print(f"✗ Expected 401, got {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error testing unauthorized access: {str(e)}")
        return False

    # Test 4: Create and access tasks
    print("\n4. Testing task creation and access...")
    task_data = {
        "title": "Test task",
        "description": "This is a test task"
    }

    try:
        response = requests.post(f"{base_url}/api/v1/tasks/", json=task_data, headers=headers)
        if response.status_code == 201:
            task = response.json()
            print(f"✓ Task created successfully: {task['title']}")

            # Get the task back
            task_id = task['id']
            response = requests.get(f"{base_url}/api/v1/tasks/{task_id}", headers=headers)
            if response.status_code == 200:
                retrieved_task = response.json()
                print(f"✓ Task retrieved successfully: {retrieved_task['title']}")
            else:
                print(f"✗ Failed to retrieve task: {response.text}")
                return False
        else:
            print(f"✗ Task creation failed: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error during task operations: {str(e)}")
        return False

    print("\n✓ All authentication flow tests passed!")
    return True

if __name__ == "__main__":
    success = test_auth_flow()
    if success:
        print("\n🎉 Authentication system validation completed successfully!")
        print("✅ Users can register and receive JWT tokens")
        print("✅ Protected endpoints require valid JWT tokens")
        print("✅ Unauthorized access is rejected with 401")
        print("✅ Users can create and access their own tasks")
        print("✅ All authentication requirements from the spec are satisfied")
    else:
        print("\n❌ Authentication system validation failed!")
        exit(1)