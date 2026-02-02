from fastapi import APIRouter, HTTPException
from schemas import Group
from database import load_data, save_data

router = APIRouter(prefix="/groups", tags=["Groups"])
FILENAME = "groups.json"
db = load_data(FILENAME)

@router.post("/")
def create(item: Group):
    db[str(item.group_id)] = item.dict()
    save_data(FILENAME, db)
    return item

@router.get("/{id}")
def read(id: int):
    return db.get(str(id))

@router.put("/{id}")
def update(id: int, item: Group):
    db[str(id)] = item.dict()
    save_data(FILENAME, db)
    return item

@router.delete("/{id}")
def delete(id: int):
    res = db.pop(str(id), None)
    save_data(FILENAME, db)
    return res