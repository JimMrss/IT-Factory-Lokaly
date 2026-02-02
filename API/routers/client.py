from fastapi import APIRouter, HTTPException
from schemas import Client
from database import load_data, save_data

router = APIRouter(prefix="/clients", tags=["Clients"])
FILENAME = "clients.json"
db = load_data(FILENAME)

@router.post("/")
def create(item: Client):
    if str(item.user_id) in db:
        raise HTTPException(status_code=400, detail="ID exists")
    db[str(item.user_id)] = item.dict()
    save_data(FILENAME, db)
    return item

@router.get("/{id}")
def read(id: int):
    if str(id) not in db:
        raise HTTPException(status_code=404)
    return db[str(id)]

@router.put("/{id}")
def update(id: int, item: Client):
    db[str(id)] = item.dict()
    save_data(FILENAME, db)
    return item

@router.delete("/{id}")
def delete(id: int):
    res = db.pop(str(id), None)
    save_data(FILENAME, db)
    return res