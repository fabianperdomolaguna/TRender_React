from pydantic import BaseModel, Field


class UpdateUser(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=120)
    role: str | None = None
    status: str | None = None
