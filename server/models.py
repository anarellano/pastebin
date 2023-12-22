from pydantic import BaseModel


class PasteData(BaseModel):
    text: str
