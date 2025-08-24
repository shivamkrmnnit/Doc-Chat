from pydantic import BaseModel

class FileRequest(BaseModel):
    fileUrl: str
    userId: str

class QueryRequest(BaseModel):
    query: str
    userId: str
