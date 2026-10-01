from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import actual_user
from app.db.database import db_client, get_document, object_id, serialize
from app.schemas.roles import EntryRole

COLLECTION = "roles"
router = APIRouter(prefix="/roles", tags=["roles"])

async def require_admin(user_id: ObjectId = Depends(actual_user)) -> ObjectId:
    document = await db_client["users"].find_one({"_id": user_id})
    if document is None or document.get("role") != "Administrador":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Requiere rol Administrador")
    return user_id

@router.get("")
async def list_roles(user_id: ObjectId = Depends(actual_user)) -> list[dict]:
    cursor = db_client[COLLECTION].find().sort("name", 1)
    return [serialize(doc) async for doc in cursor]

@router.get("/{role_id}")
async def get_role(role_id: str, _: ObjectId = Depends(actual_user)) -> dict:
    return serialize(await get_document(COLLECTION, role_id))

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_role(
    entry: EntryRole,
    _: ObjectId = Depends(require_admin),
) -> dict:
    if await db_client[COLLECTION].find_one({"name": entry.name}):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe un rol con ese nombre")

    result = await db_client[COLLECTION].insert_one({"name": entry.name})
    return {"id": str(result.inserted_id), "name": entry.name}

@router.put("/{role_id}")
async def update_role(
    role_id: str,
    entry: EntryRole,
    _: ObjectId = Depends(require_admin),
) -> dict:
    await db_client[COLLECTION].replace_one(
        {"_id": object_id(role_id)},
        {"name": entry.name},
    )
    return {"id": role_id, "name": entry.name}

@router.delete("/{role_id}")
async def delete_role(role_id: str, _: ObjectId = Depends(require_admin)) -> dict:
    result = await db_client[COLLECTION].delete_one({"_id": object_id(role_id)})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Rol no encontrado")
    return {"deleted": True, "id": role_id}
