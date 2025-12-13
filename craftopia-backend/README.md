# Craftopia Backend

FastAPI backend with  for Craftopia E-commerce.

## Setup

1.  **Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```

2.  **Database**:
    Run MongoDB via Docker:
    ```bash
    docker-compose up -d
    ```

3.  **Configuration**:
    Copy `.env.example` to `.env` and adjust if needed.

4.  **Run**:
    ```bash
    uvicorn main:app --reload
    ```

## API Docs

Visit `http://localhost:8000/docs` for Swagger UI.
