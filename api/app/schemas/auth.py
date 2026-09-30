from pydantic import BaseModel, ConfigDict, EmailStr, Field

class EntryRegistry(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class EntryLogin(BaseModel):
    email: EmailStr
    password: str

class OutputUser(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str
    name: str
    email: str
    role: str | None = None
    status: str | None = None

class OutputToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: OutputUser
