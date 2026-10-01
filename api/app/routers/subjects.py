from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import actual_user
from app.db.database import db_client

COLLECTION = "subjects"
router = APIRouter(prefix="/subjects", tags=["subjects"])

@router.get("")
async def list_subjects(user_id: ObjectId = Depends(actual_user)) -> list[dict]:
    cursor = db_client[COLLECTION].find().sort("subject", 1)
    return [
        {"id": str(doc["_id"]), "subject": doc.get("subject", "")}
        async for doc in cursor
    ]

@router.get("/active")
async def list_active_subjects(user_id: ObjectId = Depends(actual_user)) -> list[dict]:
    cursor = db_client[COLLECTION].find({"status": "Activo"}).sort("subject", 1)
    return [
        {"id": str(doc["_id"]), "subject": doc.get("subject", "")}
        async for doc in cursor
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_subject(
    name: str,
    _: ObjectId = Depends(actual_user),
) -> dict:
    name = name.strip()
    if not name:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Nombre requerido")
    if await db_client[COLLECTION].find_one({"subject": name}):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Ya existe un area con ese nombre",
        )

    document = {"subject": name, "status": "Activo"}
    result = await db_client[COLLECTION].insert_one(document)
    return {"id": str(result.inserted_id), **document}
