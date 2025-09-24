import json

with open("../collection_data/dictionary.json", "r", encoding="UTF-8") as f:
    dictionary = json.load(f)
    
dictionary = dictionary.get("results")

def translate(text):
    for item in dictionary:
        if item.get("term").lower() == text.lower():
            return item.get("translation")
    return text


with open("../collection_data/collections.json", "r", encoding="UTF-8") as f:
    collection_data = json.load(f)


for idx, collection_type in enumerate(collection_data):
    collection_data[idx]["Chinese_name"] = translate(collection_type.get("name"))
    for item_idx, item in enumerate(collection_type.get("items")):
        collection_data[idx]["items"][item_idx]["Chinese_name"] = translate(item.get("name"))


with open("../collection_data/Chinese_collections.json", "w", encoding="UTF-8") as f:
    json.dump(collection_data, f, indent=4, ensure_ascii=False)
                                    