import uvicorn
import sys

if __name__ == "__main__":
    print("Starting Craftopia API with detailed logging...")
    print(f"Python version: {sys.version}")
    
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="debug"
    )
