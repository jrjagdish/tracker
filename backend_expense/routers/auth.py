from utils import get_current_user, hash_password,verify_password,create_access_token,decode_access_token
from fastapi import APIRouter, Depends,HTTPException
from schemas import UserCreate,UserLogin,Token, UserOut
from db.prisma.client import db


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/register',response_model=Token)
async def New_user(user:UserCreate):
    existing_user = await db.user.find_first(where={"email" : user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    

    new_user = await db.user.create(
        data={
            "username" : user.username,
            "email" : user.email,
            "password" : hash_password(user.password)
        }
    )

    token = create_access_token({"user_id" : new_user.id})
    return {"access_token": token, "token_type": "bearer"}

@router.post('/login',response_model=Token)
async def login_user(user:UserLogin):
    db_user = await db.user.find_first(where={"email": user.email})
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user



