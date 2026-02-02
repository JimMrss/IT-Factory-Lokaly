from fastapi import FastAPI
from routers import client, group, annonces

app = FastAPI(title="El souper code")

app.include_router(client.router)
app.include_router(group.router)
app.include_router(annonces.router)

@app.get("/")
def root():
    return {"message": "System up"}