# McdWrapped 🍟

A tailored web application that creates a "Spotify Wrapped" style career summary for McDonald's employees. It processes your scheduling data to provide you with insights into your career journey, including total shifts, hours worked, histograms of shift duration, and the busiest months. 

### Under the Hood
This project uses the custom-built **[MyMcdAPI](https://github.com/Milos-Opletal/MyMcdAPI)** library to securely communicate with the `mymcd.eu` endpoint and fetch all required employee shift and event data.

---

## 🛠️ Prerequisites

To run this project, you will need:
- **Docker & Docker-Compose** (Recommended approach)
- Or **Python 3.11+** if running directly locally.

---

## 🚀 How to Run

### Option 1: Using Docker (Recommended)
You can easily spin up the environment with Docker Compose.
1. Make sure the Docker Daemon is running.
2. Build and start the container in the background:
   ```bash
   docker-compose up -d --build
   ```
3. Open your web browser and navigate to `http://localhost:4334`.

### Option 2: Running Locally natively
If you prefer running it independently of Docker, you can start the FastAPI application via `uvicorn`:

1. Install the required external libraries:
   ```bash
   pip install -r requirements.txt
   ```
   *(We highly recommend using a `.venv` or virtual environment for this)*

2. Start the application:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 4334
   ```

3. Open your web browser and navigate to `http://localhost:4334`.

---

## 🔒 Privacy Notice
Your credentials are intentionally **not** saved on any server and no data is kept. Standard credentials (an email and password) are securely passed straight to `mymcd.eu` natively to authorize the pull of your own encrypted data stream across the network.
