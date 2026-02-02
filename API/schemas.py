from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time

class Client(BaseModel):
    user_id: int
    identifier: str
    name: str
    surname: str
    description: str
    interests: List[str] = []
    groups: List[int] = []
    activities: List[int] = []

class Group(BaseModel):
    group_id: int
    name: str
    description: str
    members: List[int] = []
    annonces: List[int] = []

class Annonce(BaseModel):
    annonce_id: int
    name: str
    interested_users: List[int] = []
    date: date
    hour: time
    description: str
    location: str
    provider: str
    state: str