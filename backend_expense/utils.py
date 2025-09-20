from jose import jwt, JWTError
from datetime import datetime,timedelta
from passlib.context import CryptContext
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import HTTPException,Depends
from db.prisma.client import db



SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

bearer_scheme = HTTPBearer()

pwd_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict,expires_minutes : int =60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:   # includes ExpiredSignatureError-like cases
        return None
    
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = token.credentials  # ✅ get the raw token string
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.user.find_unique(where={"id": payload["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 

