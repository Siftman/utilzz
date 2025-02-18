import torch, requests
import numpy as np
from qdrant_client import QdrantClient, models
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List
import threading


client = QdrantClient("http://localhost", port=6333, timeout=20.0)
with open("shops_data.json", "r") as f:
    shops_by_cat = json.load(f)

flag_shops_lock = threading.Lock()
flag_shops = []

def process_url(url: str, expected_category: str) -> bool:
    try:
        man = 0
        woman = 0
        res = requests.post(
            "https://search.shopino.app/api/v1/encode-url/",
            headers={
                "Authorization": "Bearer b!rIue5Z^Zx9C7XCV@tbwUkZwTn+ywN5"
            },
            json={"url": url},
            timeout=5,
        )
        if res.status_code == 500:
            print(f"Skip URL: {url}")
            return None
            
        embedding = res.json()
        hits = client.search(
            collection_name="test",
            query_vector=embedding,
            limit=5,
        )
        
        for hit in hits:
            if hit.payload["sex"] == "مردانه":
                man += 1
            elif hit.payload["sex"] == "زنانه":
                woman += 1

        result = "مردانه" if man > woman else "زنانه"
        return result != expected_category
    except Exception as e:
        print(f"Error processing URL {url}: {str(e)}")
        return None

def process_shop(shop_item: tuple) -> None:
    shop_name, url_by_category = shop_item
    mismatch = 0
    valid_results = 0

    with ThreadPoolExecutor(max_workers=10) as executer:
        future_to_url = {
            executer.submit(process_url, url, category): url for url, category in url_by_category.items()
        }
        for future in as_completed(future_to_url):
            result = future.result()
            if result is not None:
                valid_results += 1
                if result:
                    mismatch += 1
    if valid_results > 0 and mismatch > (valid_results > 3):
        with flag_shops_lock:
            flag_shops.append(shop_name)


with ThreadPoolExecutor(max_workers=5) as executer:
    executer.map(process_shop, shops_by_cat.items())

with open("flagged_shops.txt", "w") as file:
    file.write("Flagged shops: " + ", ".join(flag_shops))