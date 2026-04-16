from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from analyzer import analyze_career

app = FastAPI(title="McdWrapped")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.post("/api/analyze")
async def analyze(email: str = Form(...), password: str = Form(...)):
    # This might take a few seconds, which is fine since we show a loading screen on frontend via JS fetch
    result = analyze_career(email, password)
    return result
