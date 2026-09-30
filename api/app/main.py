import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import db_client
from app.db.seed import seed
from app.routers import auth, courses, roles, sales, subjects, users

@asynccontextmanager
async def lifespan(_: FastAPI):
    await seed()
    yield

app = FastAPI(
    title="TRender API",
    description="API de administracion de cursos y ventas",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(roles.router)
app.include_router(users.router)
app.include_router(subjects.router)
app.include_router(sales.router)

@app.get("/")
def read_root():
    return {"app": "TRender API", "version": "2.0.0"}

@app.get("/health")
async def health():
    await db_client.command("ping")
    return {"status": "ok", "database": "connected"}
