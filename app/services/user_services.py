from fastapi import Depends,HTTPException,Header
from sqlalchemy.orm import Session
from jose import jwt,JWTError

from app.auth.dependencies import get_current_user

from ..core.database import get_db
from ..core.settings import settings
from ..models.user_model import User
from ..auth.hashingpwd import pwd_context
from ..auth.JWTAuth import create_access_token

from ..schemas.user_schemas import UserRegister,LoginUser



def RegisterUser(user:UserRegister,database:Session = Depends(get_db)):
    existing_user = database.query(User).filter(User.email == user.email).first()
    
    if  existing_user :
        raise HTTPException(
            status_code=409,
            detail="User Already Exists"
        )
    
    hashed_password = pwd_context.hash(user.password) 
    
    
    create_new_user = User(
        name = user.name,
        email = user.email,
        hashed_password = hashed_password
    ) 
    
    database.add(create_new_user)
    database.commit()
    database.refresh(create_new_user)
    
    return{
        "message":"User Register SucessFully"
    }
      
def UserLogin(
    user: LoginUser,
    database: Session = Depends(get_db)
):
    exists = database.query(User).filter(
        User.email == user.email
    ).first()

    if not exists:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    if not pwd_context.verify(
        user.password,
        exists.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Can't Login, Incorrect Password"
        )

    token = create_access_token(
        data={
            "sub": exists.email,
            "user_id": exists.id
        }
    )

    return {
        "message": "Login Successfully",
        "access_token": token,
        "token_type": "bearer"
    }

def ViewOwnProfile(current_user:User = Depends(get_current_user)):

    return {
        "message": "User Fetched Successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at
        }
    }
