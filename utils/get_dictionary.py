import requests
import json

payload = {
    "pageSize": 1000
}
    
response = requests.get("https://paratranz.cn/api/projects/16119/terms", params=payload)

print(response.json())

with open("../collection_data/dictionary.json", "w", encoding="UTF-8") as f:
    json.dump(response.json(), f, indent=4, ensure_ascii=False)
