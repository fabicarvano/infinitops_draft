import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models.user import User, Role
from app.core.security import get_password_hash
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./infinitops.db")

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Criar as tabelas
Base.metadata.create_all(bind=engine)

# Criar um usuário administrador inicial
db = SessionLocal()

# Verificar se já existe um usuário admin
admin_user = db.query(User).filter(User.username == "admin").first()
if not admin_user:
    # Criar o papel de administrador
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        admin_role = Role(
            name="admin",
            description="Administrador do sistema",
            permissions="*"  # Todas as permissões
        )
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)
    
    # Criar o usuário administrador
    admin_user = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        is_active=True
    )
    admin_user.roles.append(admin_role)
    db.add(admin_user)
    db.commit()
    
    print("Usuário administrador criado com sucesso!")
    print("Username: admin")
    print("Senha: admin123")
else:
    print("Usuário administrador já existe.")

db.close()
