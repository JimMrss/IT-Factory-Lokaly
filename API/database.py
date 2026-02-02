import json
import os

DATA_DIR = "data"

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def load_data(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return {}
    with open(path, "r") as f:
        return json.load(f)

def save_data(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=4)