from datetime import datetime
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.db.database import db_client, get_document, object_id, serialize
from app.core.security import actual_user
from app.schemas.sells import EntrySell

COLLECTION = "sales"
router = APIRouter(prefix="/sales", tags=["sales"])

async def _user_with_role(user_id: ObjectId) -> dict:
    document = await db_client["users"].find_one({"_id": user_id})
    if document is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario no encontrado")
    return document

async def _next_sequence() -> str:
    last = await db_client[COLLECTION].find_one(sort=[("saleNumber", -1)])
    if last is None:
        return "SO-10000"
    number = last.get("saleNumber", "SO-10000")
    try:
        sequence = int(number.removeprefix("SO-")) + 1
    except ValueError:
        total = await db_client[COLLECTION].count_documents({})
        sequence = 10000 + total + 1
    return f"SO-{sequence}"

def _sale_output(doc: dict) -> dict:
    output = serialize(doc)
    output["total"] = output.get("total", 0)
    return output

def _can_manage(user: dict, sale: dict) -> bool:
    if user.get("role") == "Vendedor":
        return sale.get("seller") == user.get("name", "")
    return True

@router.get("")
async def list_sales(
    q: Annotated[str | None, Query(max_length=120)] = None,
    user_id: ObjectId = Depends(actual_user),
) -> list[dict]:
    user = await _user_with_role(user_id)
    query_filter: dict = {}

    if user.get("role") == "Vendedor":
        query_filter["seller"] = user.get("name", "")

    cursor = db_client[COLLECTION].find(query_filter).sort("saleNumber", -1)
    sales = [_sale_output(doc) async for doc in cursor]

    if q:
        q_lower = q.lower()
        sales = [
            s
            for s in sales
            if q_lower in str(s.get("saleNumber", "")).lower()
            or q_lower in str(s.get("clientName", "")).lower()
            or q_lower in str(s.get("clientIdentity", "")).lower()
            or q_lower in str(s.get("seller", "")).lower()
        ]
    return sales

@router.get("/sequence")
async def sequence(user_id: ObjectId = Depends(actual_user)) -> dict:
    return {"saleNumber": await _next_sequence()}

@router.get("/{sale_id}")
async def get_sale(
    sale_id: str,
    user_id: ObjectId = Depends(actual_user),
) -> dict:
    doc = await get_document(COLLECTION, sale_id)
    user = await _user_with_role(user_id)
    if not _can_manage(user, doc):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "No puede ver esta venta")
    return _sale_output(doc)

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sale(
    entry: EntrySell,
    user_id: ObjectId = Depends(actual_user),
) -> dict:
    user = await _user_with_role(user_id)
    if user.get("status") and user.get("status") != "Activo":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Usuario inactivo")

    total = sum(row.total for row in entry.rows)
    total_courses = sum(row.quantity for row in entry.rows)
    document = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "saleNumber": await _next_sequence(),
        "clientName": entry.clientName,
        "clientIdentity": entry.clientIdentity,
        "rows": [row.model_dump() for row in entry.rows],
        "saleStatus": "Cerrada",
        "total": total,
        "totalCourses": total_courses,
        "seller": user.get("name", ""),
        "sellerId": str(user_id),
    }
    result = await db_client[COLLECTION].insert_one(document)
    return _sale_output({**document, "_id": result.inserted_id})

@router.put("/{sale_id}")
async def update_sale(
    sale_id: str,
    entry: EntrySell,
    user_id: ObjectId = Depends(actual_user),
) -> dict:
    doc = await get_document(COLLECTION, sale_id)
    user = await _user_with_role(user_id)
    if not _can_manage(user, doc):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "No puede editar esta venta")

    total = sum(row.total for row in entry.rows)
    total_courses = sum(row.quantity for row in entry.rows)
    data = {
        "clientName": entry.clientName,
        "clientIdentity": entry.clientIdentity,
        "rows": [row.model_dump() for row in entry.rows],
        "total": total,
        "totalCourses": total_courses,
    }
    result = await db_client[COLLECTION].find_one_and_update(
        {"_id": object_id(sale_id)},
        {"$set": data},
        return_document=True,
    )
    return _sale_output(result)

@router.delete("/{sale_id}")
async def delete_sale(
    sale_id: str,
    user_id: ObjectId = Depends(actual_user),
) -> dict:
    doc = await get_document(COLLECTION, sale_id)
    user = await _user_with_role(user_id)
    if not _can_manage(user, doc):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "No puede eliminar esta venta")

    await db_client[COLLECTION].delete_one({"_id": doc["_id"]})
    return {"deleted": True, "id": sale_id}
