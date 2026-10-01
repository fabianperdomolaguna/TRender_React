import os

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo import AsyncMongoClient

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb://localhost:27017",
)

MONGODB_DATABASE = os.getenv(
    "MONGODB_DATABASE",
    "trenderdb",
)

db_client = AsyncMongoClient(MONGODB_URL)[MONGODB_DATABASE]

def serialize(
    document: dict | None,
    exclude: set[str] | None = None,
) -> dict | None:
    if document is None:
        return None

    data = dict(document)
    data["id"] = str(data.pop("_id"))
    for field in exclude or ():
        data.pop(field, None)
    return data

def object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Invalid Id",
        ) from exc

async def get_document(collection: str, id_str: str) -> dict:
    document = await db_client[collection].find_one({"_id": object_id(id_str)})
    if document is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return document
