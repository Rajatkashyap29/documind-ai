from fastapi import Depends, Header, HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.settings import settings
from ..models.user_model import User


def get_current_user(
    authorization: str = Header(...),
    database: Session = Depends(get_db)
):
    
    token = authorization.replace("Bearer ", "")
    try:
        
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    email = payload.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    user = database.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return user