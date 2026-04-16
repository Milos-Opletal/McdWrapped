FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install Python dependencies directly
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    jinja2 \
    requests \
    beautifulsoup4 \
    python-multipart

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Copy application files
COPY . .

# Expose the application port
EXPOSE 4334
