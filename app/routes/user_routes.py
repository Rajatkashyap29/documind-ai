from fastapi import APIRouter, Depends,Header
from sqlalchemy.orm import Session


from ..schemas.user_schemas import UserRegister,LoginUser
from ..models.user_model import User
from ..auth.dependencies import get_current_user
from ..core.database import get_db
from ..services.user_services import RegisterUser,UserLogin,ViewOwnProfile


router = APIRouter(tags=["Documind AI"])



@router.post('/register')
def register(user:UserRegister,database:Session = Depends(get_db)):
    return RegisterUser(user,database)

@router.post('/login')
def loginuser(user:LoginUser,database:Session = Depends(get_db)):
    return UserLogin(user,database)

@router.get('/profile')
def viewprofile(current_user:User = Depends(get_current_user)):
    return ViewOwnProfile(current_user)