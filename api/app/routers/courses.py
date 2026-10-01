from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import actual_user
from app.db.database import db_client, get_document, object_id, serialize
from app.schemas.courses import VALID_STATUS, VALID_SUBJECTS, EntryCourse

COLLECTION = "courses"
router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("")
async def list_courses(user_id: ObjectId = Depends(actual_user)) -> list[dict]:
    cursor = db_client[COLLECTION].find().sort("course", 1)
    return [serialize(doc) async for doc in cursor]

@router.get("/active")
async def list_active_courses(user_id: ObjectId = Depends(actual_user)) -> list[dict]:
    cursor = db_client[COLLECTION].find({"status": "Activo"}).sort("course", 1)
    return [serialize(doc) async for doc in cursor]

@router.get("/{course_id}")
async def get_course(course_id: str, _: ObjectId = Depends(actual_user)) -> dict:
    return serialize(await get_document(COLLECTION, course_id))

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_course(
    entry: EntryCourse,
    _: ObjectId = Depends(actual_user),
) -> dict:
    if entry.subject not in VALID_SUBJECTS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Area no valida")
    if entry.status not in VALID_STATUS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Estado no valido")

    data = entry.model_dump()
    result = await db_client[COLLECTION].insert_one(data)
    return serialize({**data, "_id": result.inserted_id})

@router.put("/{course_id}")
async def update_course(
    course_id: str,
    entry: EntryCourse,
    _: ObjectId = Depends(actual_user),
) -> dict:
    if entry.subject not in VALID_SUBJECTS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Area no valida")
    if entry.status not in VALID_STATUS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Estado no valido")

    data = entry.model_dump()
    result = await db_client[COLLECTION].replace_one(
        {"_id": object_id(course_id)},
        data,
    )
    if result.matched_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Curso no encontrado")
    return serialize({**data, "_id": object_id(course_id)})

@router.delete("/{course_id}")
async def delete_course(course_id: str, _: ObjectId = Depends(actual_user)) -> dict:
    result = await db_client[COLLECTION].delete_one({"_id": object_id(course_id)})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Curso no encontrado")
    return {"deleted": True, "id": course_id}
