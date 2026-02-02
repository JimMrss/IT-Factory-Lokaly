#Généré par IA pour les test, me jetez pas de kaiou please 
import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    # 1. Create a Client
    print("--- Testing Client ---")
    client_data = {
        "user_id": 1,
        "identifier": "maria.jolie",
        "name": "Maria",
        "surname": "Jolie",
        "description": "Loves hiking and tech",
        "interests": ["coding", "mountains"],
        "groups": [101],
        "activities": [501]
    }
    res_c = requests.post(f"{BASE_URL}/clients/", json=client_data)
    print(f"Create Client: {res_c.status_code} | {res_c.json()}")

    # 2. Create a Group
    print("\n--- Testing Group ---")
    group_data = {
        "group_id": 101,
        "name": "Python Enthusiasts",
        "description": "A group for AI and Backend devs",
        "members": [1],
        "annonces": [501]
    }
    res_g = requests.post(f"{BASE_URL}/groups/", json=group_data)
    print(f"Create Group: {res_g.status_code} | {res_g.json()}")

    # 3. Create an Annonce
    print("\n--- Testing Annonce ---")
    annonce_data = {
        "annonce_id": 501,
        "name": "FastAPI Workshop",
        "interested_users": [1],
        "date": "2026-03-15",
        "hour": "14:30:00",
        "description": "Learning modular API structures",
        "location": "Brest, France",
        "provider": "Maria",
        "state": "active"
    }
    res_a = requests.post(f"{BASE_URL}/annonces/", json=annonce_data)
    print(f"Create Annonce: {res_a.status_code} | {res_a.json()}")

    # 4. Verification: Get the Client back to see if IDs match
    print("\n--- Final Verification ---")
    final_check = requests.get(f"{BASE_URL}/clients/1")
    data = final_check.json()
    print(f"Client {data['identifier']} is in Group {data['groups']} and Activity {data['activities']}")

if __name__ == "__main__":
    try:
        run_tests()
    except requests.exceptions.ConnectionError:
        print("ERROR: Is the Uvicorn server running? Make sure to run 'uvicorn main:app --reload' first.")