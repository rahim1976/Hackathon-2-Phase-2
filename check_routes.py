import os
os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
from backend.src.main import app

print("Registered routes:")
for route in app.routes:
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        print(f"  {route.methods} {route.path}")