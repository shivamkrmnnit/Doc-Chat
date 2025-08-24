# ------------ Stage 1: Builder ------------
FROM python:3.11-slim AS builder

WORKDIR /install

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies into a wheel cache directory
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip wheel --no-cache-dir --wheel-dir /install/wheels -r requirements.txt


# ------------ Stage 2: Final Image ------------
FROM python:3.11-slim

WORKDIR /app

# Install only runtime dependencies
COPY --from=builder /install/wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/* && \
    rm -rf /wheels

# Copy source code
COPY . .

# Expose port
EXPOSE 7001

# Run the FastAPI app using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7001"]
