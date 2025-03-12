import requests
import json
import os
from dotenv import load_dotenv

# Load API keys from .env file
load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
QWEN_API_KEY = os.getenv("QWEN_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

HEADERS = {"Content-Type": "application/json"}

def fetch_news_from_deepseek():
    url = "https://api.deepseek.com/v1/chat/completions"
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": "Fetch top 10 trending news headlines with summaries and source links for today."}],
        "temperature": 0.7
    }
    headers = {**HEADERS, "Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
    response = requests.post(url, json=data, headers=headers)
    return response.json().get("news", [])

def fetch_news_from_qwen():
    url = "https://api.qwen.com/v1/completions"
    data = {
        "model": "qwen-model",
        "messages": [{"role": "user", "content": "Get the latest trending news with summaries and source links."}],
        "temperature": 0.7
    }
    headers = {**HEADERS, "Authorization": f"Bearer {QWEN_API_KEY}"}
    response = requests.post(url, json=data, headers=headers)
    return response.json().get("news", [])

def fetch_news_from_gemini():
    url = "https://api.gemini.com/v1/completions"
    data = {
        "model": "gemini-model",
        "messages": [{"role": "user", "content": "Give today's top 10 news headlines with summaries and source links."}],
        "temperature": 0.7
    }
    headers = {**HEADERS, "Authorization": f"Bearer {GEMINI_API_KEY}"}
    response = requests.post(url, json=data, headers=headers)
    return response.json().get("news", [])

# Fetch and combine news from all sources
news_data = {
    "date": "YYYY-MM-DD",
    "news": fetch_news_from_deepseek() + fetch_news_from_qwen() + fetch_news_from_gemini()
}

# Save to JSON file
with open("news.json", "w") as file:
    json.dump(news_data, file, indent=4)

print("News updated successfully!")
