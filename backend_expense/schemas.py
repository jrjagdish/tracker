from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username : str
    email : str
    password : str

class UserLogin(BaseModel):
    email: str
    password: str   

class UserOut(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True     

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: Optional[datetime] = None

class ExpenseOut(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: datetime    

    class Config:
       from_attributes = True   

class Token(BaseModel):
    access_token: str
    token_type: str     