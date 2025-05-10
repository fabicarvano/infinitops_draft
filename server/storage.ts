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
  
  // Matriz de Ativos
  getAssetMatrices(): Promise<AssetMatrix[]>;
  getAssetMatrix(id: number): Promise<AssetMatrix | undefined>; 
  getAssetMatrixByContract(contractId: number): Promise<AssetMatrix | undefined>;
  createAssetMatrix(assetMatrix: InsertAssetMatrix): Promise<AssetMatrix>;
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
    
    // Criar um contrato ativo com matriz de ativos
    this.createContract({
      client_id: 1,
      name: "Contrato com Matriz Ativa",
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      renewal_type: "client",
      description: "Contrato demonstrativo com matriz de ativos preenchida",
      technical_contact: "Carlos Silva",
      commercial_contact: "Ana Martins"
    }).then((contract) => {
      // Criar uma matriz de ativos para este contrato
      this.createAssetMatrix({
        contract_id: contract.id,
        name: "Matriz Principal",
        description: "Matriz de ativos completa com informações de suporte N1 e N2"
      }).then((matrix) => {
        // Criar alguns ativos para esta matriz
        this.createAsset({
          name: "Servidor de Aplicação",
          type: "servidor",
          client_id: 1,
          contract_id: contract.id,
          status: "active",
          criticality: "high",
          hostname: "srv-app-01",
          ip_address: "192.168.1.100",
          zabbix_id: "SRV-APP-01"
        });
        
        this.createAsset({
          name: "Firewall Principal",
          type: "firewall",
          client_id: 1,
          contract_id: contract.id,
          status: "active",
          criticality: "critical",
          hostname: "fw-main-01",
          ip_address: "192.168.1.1",
          zabbix_id: "FW-MAIN-01"
        });
        
        // Criar atividade de criação de matriz
        this.createActivity({
          description: "Matriz de ativos criada para o contrato",
          action_type: "create",
          resource_type: "asset_matrix",
          resource_id: matrix.id,
          user_id: 1
        });
      });
    });
    
    // Criar alertas
    this.createAlert({
      asset_id: 1,
      severity: "medium",
      message: "CPU acima de 80%",
      status: "open"
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
  
  // Implementação dos métodos de Matriz de Ativos
  async getAssetMatrices(): Promise<AssetMatrix[]> {
    return Array.from(this.assetMatrices.values());
  }
  
  async getAssetMatrix(id: number): Promise<AssetMatrix | undefined> {
    return this.assetMatrices.get(id);
  }
  
  async getAssetMatrixByContract(contractId: number): Promise<AssetMatrix | undefined> {
    return Array.from(this.assetMatrices.values()).find(matrix => matrix.contract_id === contractId);
  }
  
  async createAssetMatrix(assetMatrix: InsertAssetMatrix): Promise<AssetMatrix> {
    const id = this.assetMatrixId++;
    const newAssetMatrix: AssetMatrix = { 
      ...assetMatrix, 
      id,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.assetMatrices.set(id, newAssetMatrix);
    return newAssetMatrix;
  }
}

export const storage = new MemStorage();
