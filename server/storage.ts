import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  contracts, type Contract, type InsertContract,
  assets, type Asset, type InsertAsset,
  alerts, type Alert, type InsertAlert, 
  tickets, type Ticket, type InsertTicket,
  activities, type Activity, type InsertActivity,
  integrations, type Integration, type InsertIntegration,
  assetMatrices, type AssetMatrix, type InsertAssetMatrix
} from "@shared/schema";

interface Stats {
  totalClients: number;
  totalAssets: number;
  criticalAlerts: number;
  openTickets: number;
}

export interface IStorage {
  // Usuários
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clientes
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Contratos
  getContracts(): Promise<Contract[]>;
  getContract(id: number): Promise<Contract | undefined>;
  getContractsByClient(clientId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  
  // Ativos
  getAssets(): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetsByClient(clientId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  
  // Alertas
  getAlerts(): Promise<Alert[]>;
  getAlertsByAsset(assetId: number): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // Chamados
  getTickets(): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsByAsset(assetId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  
  // Atividades
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Integrações
  getIntegrations(): Promise<Integration[]>;
  getIntegration(id: number): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private contracts: Map<number, Contract>;
  private assets: Map<number, Asset>;
  private alerts: Map<number, Alert>;
  private tickets: Map<number, Ticket>;
  private activities: Map<number, Activity>;
  private integrations: Map<number, Integration>;
  
  private userId: number;
  private clientId: number;
  private contractId: number;
  private assetId: number;
  private alertId: number;
  private ticketId: number;
  private activityId: number;
  private integrationId: number;
  private assetMatrixId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.contracts = new Map();
    this.assets = new Map();
    this.alerts = new Map();
    this.tickets = new Map();
    this.activities = new Map();
    this.integrations = new Map();
    this.assetMatrices = new Map();
    
    this.userId = 1;
    this.clientId = 1;
    this.contractId = 1;
    this.assetId = 1;
    this.alertId = 1;
    this.ticketId = 1;
    this.assetMatrixId = 1;
    this.activityId = 1;
    this.integrationId = 1;
    
    // Inserir alguns dados de demonstração
    this.setupMockData();
  }
  
  private setupMockData() {
    // Inserir usuários de demonstração
    this.createUser({
      username: "admin",
      name: "Admin NOC",
      email: "admin@ccocore.com",
      role: "admin"
    });
    
    // Inserir clientes de demonstração
    const client1 = this.createClient({
      name: "Acme Corp",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const client2 = this.createClient({
      name: "Tech Solutions",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const client3 = this.createClient({
      name: "Global Services",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Criar contratos
    this.createContract({
      clientId: 1,
      name: "Suporte Padrão",
      status: "active",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      renewalType: "client",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createContract({
      clientId: 2,
      name: "Suporte Premium",
      status: "active",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      renewalType: "internal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Criar ativos
    this.createAsset({
      clientId: 1,
      contractId: 1,
      name: "Servidor Web",
      type: "server",
      ipAddress: "192.168.1.10",
      hostname: "srv-web-01",
      criticality: "high",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createAsset({
      clientId: 1,
      contractId: 1,
      name: "Servidor DB",
      type: "server",
      ipAddress: "192.168.1.11",
      hostname: "srv-db-01",
      criticality: "critical",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createAsset({
      clientId: 2,
      contractId: 2,
      name: "Firewall",
      type: "network",
      ipAddress: "192.168.1.1",
      hostname: "fw-01",
      criticality: "critical",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Criar alertas
    this.createAlert({
      assetId: 1,
      severity: "medium",
      message: "CPU acima de 80%",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createAlert({
      assetId: 2,
      severity: "critical",
      message: "Disco cheio",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createAlert({
      assetId: 3,
      severity: "critical",
      message: "Tráfego suspeito detectado",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Criar chamados
    this.createTicket({
      assetId: 1,
      title: "Lentidão no servidor web",
      description: "Usuários reportando lentidão no acesso ao sistema",
      status: "open",
      priority: "medium",
      createdBy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.createTicket({
      assetId: 2,
      title: "Erro de disco cheio",
      description: "Sistema não consegue escrever no banco de dados",
      status: "in_progress",
      priority: "critical",
      assigneeId: 1,
      createdBy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Criar atividades
    this.createActivity({
      userId: 1,
      actionType: "ticket_created",
      resourceType: "ticket",
      resourceId: 1,
      description: "Ticket #1 criado",
      createdAt: new Date().toISOString()
    });
    
    this.createActivity({
      userId: 1,
      actionType: "alert_generated",
      resourceType: "alert",
      resourceId: 1,
      description: "Alerta gerado para CPU alta",
      createdAt: new Date().toISOString()
    });
  }

  // Implementação dos métodos de Usuários
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Implementação dos métodos de Clientes
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }
  
  // Implementação dos métodos de Contratos
  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values());
  }
  
  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }
  
  async getContractsByClient(clientId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      (contract) => contract.clientId === clientId
    );
  }
  
  async createContract(contract: InsertContract): Promise<Contract> {
    const id = this.contractId++;
    const newContract: Contract = { ...contract, id };
    this.contracts.set(id, newContract);
    return newContract;
  }
  
  // Implementação dos métodos de Ativos
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }
  
  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }
  
  async getAssetsByClient(clientId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.clientId === clientId
    );
  }
  
  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const newAsset: Asset = { ...asset, id };
    this.assets.set(id, newAsset);
    return newAsset;
  }
  
  // Implementação dos métodos de Alertas
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }
  
  async getAlertsByAsset(assetId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.assetId === assetId
    );
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const newAlert: Alert = { ...alert, id };
    this.alerts.set(id, newAlert);
    return newAlert;
  }
  
  // Implementação dos métodos de Chamados
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }
  
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  async getTicketsByAsset(assetId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.assetId === assetId
    );
  }
  
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = this.ticketId++;
    const newTicket: Ticket = { ...ticket, id };
    this.tickets.set(id, newTicket);
    return newTicket;
  }
  
  // Implementação dos métodos de Atividades
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  // Implementação dos métodos de Integrações
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }
  
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }
  
  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const id = this.integrationId++;
    const newIntegration: Integration = { ...integration, id };
    this.integrations.set(id, newIntegration);
    return newIntegration;
  }
}

export const storage = new MemStorage();
