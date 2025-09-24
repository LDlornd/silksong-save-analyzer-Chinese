import requests
import json


def translate(text):
    payload = { "text": text, "source": "en", "target": "ja" }
    
    response = requests.get("https://paratranz.cn/api/projects/16119/terms", params=payload)
    return response.json()["responseData"]["translatedText"]


def main():
    with open("collections.json", "r", encoding="UTF-8") as f:
        data = json.load(f)
    

if __name__ == "__main__":
    main()
