from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ServiceLevel(str, enum.Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    VIP = "vip"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default=TicketStatus.OPEN)
    priority = Column(String, default=TicketPriority.MEDIUM)
    
    client_id = Column(Integer, ForeignKey("clients.id"))
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    sla_expiration = Column(DateTime(timezone=True), nullable=True)
    
    # Relacionamentos
    client = relationship("Client", back_populates="tickets")
    asset = relationship("Asset", back_populates="tickets")
    assignee = relationship("User")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_info = Column(Text)
    service_level = Column(String, default=ServiceLevel.STANDARD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    tickets = relationship("Ticket", back_populates="client")
    assets = relationship("Asset", back_populates="client")
    contracts = relationship("Contract", back_populates="client")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    status = Column(String)
    client_id = Column(Integer, ForeignKey("clients.id"))
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    client = relationship("Client", back_populates="assets")
    location = relationship("Location", back_populates="assets")
    tickets = relationship("Ticket", back_populates="asset")
    licenses = relationship("License", back_populates="asset")
    asset_matrices = relationship("AssetMatrix", back_populates="asset")

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(Text)
    type = Column(String)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    assets = relationship("Asset", back_populates="location")

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    client = relationship("Client", back_populates="contracts")
    asset_matrices = relationship("AssetMatrix", back_populates="contract")

class License(Base):
    __tablename__ = "licenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    expiration_date = Column(DateTime(timezone=True))
    renewal_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    asset = relationship("Asset", back_populates="licenses")

class AssetMatrix(Base):
    __tablename__ = "asset_matrices"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    asset = relationship("Asset", back_populates="asset_matrices")
    contract = relationship("Contract", back_populates="asset_matrices")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    severity = Column(String)
    status = Column(String)
    related_asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    acknowledged_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relacionamentos
    related_asset = relationship("Asset")
    acknowledger = relationship("User")
