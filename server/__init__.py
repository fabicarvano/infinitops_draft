from app.models.user import User, Role
from app.models.entities import (
    Ticket, Client, Asset, Location, Contract, 
    License, AssetMatrix, Alert
)

# Importar todos os modelos aqui para que o Alembic possa detectá-los
