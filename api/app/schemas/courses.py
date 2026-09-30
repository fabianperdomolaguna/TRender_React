from pydantic import BaseModel, Field

VALID_SUBJECTS = ("OOP", "Móvil", "Web", "Desarrollo de Software")
VALID_STATUS = ("Activo", "Cancelado")

class EntryCourse(BaseModel):
    course: str = Field(min_length=2, max_length=120)
    subject: str
    instructor: str = Field(min_length=1, max_length=120)
    cost: float = Field(ge=0)
    status: str
