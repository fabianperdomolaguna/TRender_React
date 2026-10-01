import pytest
from bson import ObjectId
from fastapi import HTTPException
from app.db.database import object_id, serialize

def test_serialize_returns_none_when_document_is_none():
    assert serialize(None) is None

def test_serialize_converts_id_to_string():
    oid = ObjectId()
    data = serialize({"_id": oid, "name": "Ana"})
    assert data == {"id": str(oid), "name": "Ana"}

def test_serialize_excludes_requested_fields():
    oid = ObjectId()
    data = serialize({"_id": oid, "name": "Ana", "password": "x"}, exclude={"password"})
    assert "password" not in data
    assert data["id"] == str(oid)

def test_serialize_does_not_mutate_original_document():
    oid = ObjectId()
    doc = {"_id": oid, "name": "Ana"}
    serialize(doc)
    assert doc["_id"] == oid

def test_object_id_accepts_valid_id():
    oid = ObjectId()
    assert object_id(str(oid)) == oid

def test_object_id_rejects_invalid_id_with_400():
    with pytest.raises(HTTPException) as exc_info:
        object_id("no-es-un-id")
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Invalid Id"
