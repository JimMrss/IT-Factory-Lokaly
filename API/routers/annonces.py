from fastapi import APIRouter, HTTPException
from schemas import Annonce
from database import load_data, save_data

router = APIRouter(prefix="/annonces", tags=["Annonces"])
FILENAME = "annonces.json"
db = load_data(FILENAME)

@router.post("/")
def create(item: Annonce):
    data = item.dict()
    data['date'] = str(data['date'])
    data['hour'] = str(data['hour'])
    db[str(item.annonce_id)] = data
    save_data(FILENAME, db)
    return data

@router.get("/{id}")
def read(id: int):
    return db.get(str(id))

@router.put("/{id}")
def update(id: int, item: Annonce):
    data = item.dict()
    data['date'] = str(data['date'])
    data['hour'] = str(data['hour'])
    db[str(id)] = data
    save_data(FILENAME, db)
    return data

@router.delete("/{id}")
def delete(id: int):
    res = db.pop(str(id), None)
    save_data(FILENAME, db)
    return res