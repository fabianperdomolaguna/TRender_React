from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.database import db_client, get_document, object_id, serialize
from app.core.security import actual_user
from app.routers.roles import require_admin
from app.schemas.users import UpdateUser

COLLECTION = "users"
VALID_ROLES = ("", "Administrador", "Vendedor", "Estudiante")
VALID_STATUS = ("", "Activo", "Inactivo")
router = APIRouter(prefix="/users", tags=["users"])

@router.get("")
async def list_users(_: ObjectId = Depends(require_admin)) -> list[dict]:
    cursor = db_client[COLLECTION].find().sort("name", 1)
    return [serialize(doc, exclude={"password"}) async for doc in cursor]

@router.get("/{user_id}")
async def get_user(
    user_id: str,
    current_id: ObjectId = Depends(actual_user),
) -> dict:
    if str(current_id) != user_id:
        await require_admin(current_id)
    document = await get_document(COLLECTION, user_id)
    return serialize(document, exclude={"password"})

@router.put("/{user_id}")
async def update_user(
    user_id: str,
    entry: UpdateUser,
    _: ObjectId = Depends(require_admin),
) -> dict:
    if entry.role is not None and entry.role not in VALID_ROLES:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Rol no valido")
    if entry.status is not None and entry.status not in VALID_STATUS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Estado no valido")

    data = {k: v for k, v in entry.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "No hay campos para actualizar",
        )

    result = await db_client[COLLECTION].find_one_and_update(
        {"_id": object_id(user_id)},
        {"$set": data},
        return_document=True,
    )
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
    return serialize(result, exclude={"password"})

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    _: ObjectId = Depends(require_admin),
) -> None:
    result = await db_client[COLLECTION].delete_one({"_id": object_id(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
