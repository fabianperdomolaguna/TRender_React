from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import actual_user, create_token, hash_password, verify_password
from app.db.database import db_client, serialize
from app.schemas.auth import EntryLogin, EntryRegistry, OutputToken, OutputUser

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(
    "/register",
    response_model=OutputToken,
    status_code=status.HTTP_201_CREATED,
)
async def register(entry: EntryRegistry) -> OutputToken:
    email = entry.email.lower()
    if await db_client["users"].find_one({"email": email}):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Ya existe un usuario con este email",
        )

    document = {
        "name": entry.name.strip(),
        "email": email,
        "password": hash_password(entry.password),
        "role": "",
        "status": "",
    }
    result = await db_client["users"].insert_one(document)
    user = OutputUser(
        id=str(result.inserted_id),
        name=document["name"],
        email=email,
        role="",
        status="",
    )
    return OutputToken(
        access_token=create_token(str(result.inserted_id)),
        user=user,
    )

@router.post("/login", response_model=OutputToken)
async def login(entry: EntryLogin) -> OutputToken:
    document = await db_client["users"].find_one({"email": entry.email.lower()})
    if (
        document is None
        or "password" not in document
        or not verify_password(entry.password, document["password"])
    ):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Incorrect email or password",
        )

    return OutputToken(
        access_token=create_token(str(document["_id"])),
        user=OutputUser(**serialize(document, exclude={"password"})),
    )

@router.get("/me", response_model=OutputUser)
async def me(user_id: ObjectId = Depends(actual_user)) -> OutputUser:
    document = await db_client["users"].find_one({"_id": user_id})
    if document is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario no encontrado")
    return OutputUser(**serialize(document, exclude={"password"}))
