from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo usuário.
    """
    # Verificar se o usuário já existe
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Um usuário com este email já existe no sistema."
        )
    
    user = db.query(User).filter(User.username == user_in.username).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Um usuário com este nome de usuário já existe no sistema."
        )
    
    # Criar o novo usuário
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_active=user_in.is_active
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=UserSchema)
def read_current_user(
    current_user: User = Depends(get_current_user)
):
    """
    Obtém o usuário atual.
    """
    return current_user
