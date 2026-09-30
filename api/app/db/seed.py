import os
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from app.db.database import db_client

_hasher = PasswordHash((BcryptHasher(),))

BASE_ROLES = ("Administrador", "Estudiante", "Vendedor")
BASE_SUBJECTS = ("OOP", "Móvil", "Web", "Desarrollo de Software")
BASE_COURSES = (
    {
        "course": "Programación Orientada a Objetos",
        "subject": "OOP",
        "instructor": "Fabian Perdomo",
        "cost": 120000,
        "status": "Activo",
    },
    {
        "course": "React desde cero",
        "subject": "Web",
        "instructor": "Fabian Perdomo",
        "cost": 150000,
        "status": "Activo",
    },
    {
        "course": "Desarrollo de Apps Móviles",
        "subject": "Móvil",
        "instructor": "Fabian Perdomo",
        "cost": 180000,
        "status": "Activo",
    },
)

async def seed() -> None:
    for role in BASE_ROLES:
        await db_client["roles"].update_one(
            {"name": role},
            {"$setOnInsert": {"name": role}},
            upsert=True,
        )

    for subject in BASE_SUBJECTS:
        await db_client["subjects"].update_one(
            {"subject": subject},
            {"$setOnInsert": {"subject": subject, "status": "Activo"}},
            upsert=True,
        )

    for course in BASE_COURSES:
        await db_client["courses"].update_one(
            {"course": course["course"]},
            {"$setOnInsert": course},
            upsert=True,
        )

    admin_email = os.getenv("ADMIN_EMAIL").lower()
    admin_password = os.getenv("ADMIN_PASSWORD")
    if await db_client["users"].find_one({"email": admin_email}) is None:
        await db_client["users"].insert_one(
            {
                "name": os.getenv("Administrador"),
                "email": admin_email,
                "password": _hasher.hash(admin_password),
                "role": "Administrador",
                "status": "Activo",
            }
        )
