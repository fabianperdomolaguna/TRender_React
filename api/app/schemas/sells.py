from pydantic import BaseModel, Field


class SellRowInfo(BaseModel):
    course: str = Field(min_length=1)
    subject: str = Field(min_length=1)
    quantity: int = Field(ge=1)
    price: float = Field(ge=0)
    total: float = Field(ge=0)

class EntrySell(BaseModel):
    clientName: str = Field(min_length=3, max_length=120)
    clientIdentity: str = Field(min_length=3, max_length=60)
    rows: list[SellRowInfo] = Field(min_length=1)
