import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  contracts, type Contract, type InsertContract,
  assets, type Asset, type InsertAsset,
  alerts, type Alert, type InsertAlert, 
  tickets, type Ticket, type InsertTicket,
  activities, type Activity, type InsertActivity,
  integrations, type Integration, type InsertIntegration,
  assetMatrices, type AssetMatrix, type InsertAssetMatrix,
  locations, type Location, type InsertLocation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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
  
  // Localizações
  getLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  getLocationsByClient(clientId: number): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
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
  private assetMatrices: Map<number, AssetMatrix>;
  private locations: Map<number, Location>;
  
  private userId: number;
  private clientId: number;
  private contractId: number;
  private assetId: number;
  private alertId: number;
  private ticketId: number;
  private activityId: number;
  private integrationId: number;
  private assetMatrixId: number;
  private locationId: number;

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
    this.locations = new Map();
    
    this.userId = 1;
    this.clientId = 1;
    this.contractId = 1;
    this.assetId = 1;
    this.alertId = 1;
    this.ticketId = 1;
    this.assetMatrixId = 1;
    this.activityId = 1;
    this.integrationId = 1;
    this.locationId = 1;
    
    // Inserir alguns dados de demonstração
    this.setupMockData();
  }
  
  private setupMockData() {
    // Inserir usuários de demonstração
    this.createUser({
      username: "admin",
      name: "Admin NOC",
      email: "admin@ccocore.com",
      password: "admin123", // Nunca usar senhas simples em produção
      role: "admin"
    });
    
    // Inserir clientes de demonstração
    const client1 = this.createClient({
      name: "Acme Corp",
      status: "active"
    });
    
    const client2 = this.createClient({
      name: "Tech Solutions",
      status: "active"
    });
    
    const client3 = this.createClient({
      name: "Global Services",
      status: "active"
    });
    
    // Adicionar o cliente TechFibra Telecomunicações
    const techFibra = this.createClient({
      name: "TechFibra Telecomunicações",
      status: "active"
    });
    
    // Criar contratos
    this.createContract({
      client_id: 1,
      name: "Suporte Padrão",
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      renewal_type: "client",
      description: "Contrato de suporte padrão",
      technical_contact: "José Silva",
      commercial_contact: "Maria Souza"
    });
    
    this.createContract({
      client_id: 2,
      name: "Suporte Premium",
      status: "active",
      start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      renewal_type: "internal",
      description: "Contrato de suporte premium",
      technical_contact: "Fernando Costa",
      commercial_contact: "Roberto Dias"
    });
    
    // Adicionar contrato VIP para TechFibra
    const techFibraContrato = this.createContract({
      client_id: 4, // TechFibra
      name: "Suporte VIP",
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      renewal_type: "auto",
      description: "Contrato de suporte VIP com atendimento prioritário",
      technical_contact: "Carlos Nascimento",
      commercial_contact: "Luciana Pereira"
    }).then((contract) => {
      // Criar uma matriz de ativos para o contrato VIP da TechFibra
      this.createAssetMatrix({
        contract_id: contract.id,
        name: "Matriz TechFibra VIP",
        description: "Matriz de ativos completa da TechFibra com atendimento VIP",
        
        // Dados de Suporte N1
        support_n1_name: "Equipe VIP de Suporte N1",
        support_n1_email: "vip.n1@techfibra.com.br",
        support_n1_phone: "(11) 4444-1111",
        support_n1_schedule: "24x7",
        support_n1_response_time: "5 minutos",
        
        // Dados de Suporte N2
        support_n2_name: "Equipe VIP de Suporte N2",
        support_n2_email: "vip.n2@techfibra.com.br",
        support_n2_phone: "(11) 4444-2222",
        support_n2_schedule: "24x7",
        support_n2_response_time: "30 minutos",
        
        // Dados de Suporte N3
        support_n3_name: "Equipe VIP de Suporte N3",
        support_n3_email: "vip.n3@techfibra.com.br",
        support_n3_phone: "(11) 4444-3333",
        support_n3_schedule: "24x7",
        support_n3_response_time: "2 horas",
        
        // Dados do dono do ativo
        asset_owner_name: "Roberto Mendes",
        asset_owner_email: "roberto.mendes@techfibra.com.br",
        asset_owner_phone: "(11) 98765-0000",
        asset_owner_department: "Infraestrutura",
        
        // Dados de monitoramento
        monitoring_tool: "Zabbix Enterprise",
        monitoring_url: "https://zabbix.techfibra.com.br",
        
        // Dados de atendimento presencial
        onsite_support_available: true,
        onsite_support_address: "Rua dos Andradas, 500, São Paulo, SP",
        onsite_support_contact: "Marcos Oliveira (11) 97777-6666",
        onsite_support_schedule: "24x7"
      });
    });
    
    // Criar ativos
    this.createAsset({
      client_id: 1,
      contract_id: 1,
      name: "Servidor Web",
      type: "server",
      ip_address: "192.168.1.10",
      hostname: "srv-web-01",
      criticality: "high",
      status: "active"
    });
    
    this.createAsset({
      client_id: 1,
      contract_id: 1,
      name: "Servidor DB",
      type: "server",
      ip_address: "192.168.1.11",
      hostname: "srv-db-01",
      criticality: "critical",
      status: "active"
    });
    
    this.createAsset({
      client_id: 2,
      contract_id: 2,
      name: "Firewall",
      type: "network",
      ip_address: "192.168.1.1",
      hostname: "fw-01",
      criticality: "critical",
      status: "active"
    });
    
    // Adicionar ativos para TechFibra
    this.createAsset({
      client_id: 4,
      contract_id: 3,
      name: "Switch Core Principal",
      type: "network",
      ip_address: "192.168.10.1",
      hostname: "switch-core-01",
      criticality: "critical",
      status: "active"
    });
    
    this.createAsset({
      client_id: 4,
      contract_id: 3,
      name: "Servidor de Gerenciamento",
      type: "server",
      ip_address: "192.168.10.10",
      hostname: "srv-mgmt-01",
      criticality: "high",
      status: "active"
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
      // Criar uma matriz de ativos para este contrato com dados de N1 e N2
      this.createAssetMatrix({
        contract_id: contract.id,
        name: "Matriz Principal",
        description: "Matriz de ativos completa com informações de suporte N1 e N2",
        
        // Dados de Suporte N1
        support_n1_name: "Equipe de Suporte N1",
        support_n1_email: "suporte.n1@empresa.com.br",
        support_n1_phone: "(11) 5555-1111",
        support_n1_schedule: "24x7",
        support_n1_response_time: "15 minutos",
        
        // Dados de Suporte N2
        support_n2_name: "Equipe de Suporte N2",
        support_n2_email: "suporte.n2@empresa.com.br",
        support_n2_phone: "(11) 5555-2222",
        support_n2_schedule: "8x5",
        support_n2_response_time: "2 horas",
        
        // Dados de Suporte N3
        support_n3_name: "Equipe de Suporte N3",
        support_n3_email: "suporte.n3@empresa.com.br",
        support_n3_phone: "(11) 5555-3333",
        support_n3_schedule: "8x5",
        support_n3_response_time: "4 horas",
        
        // Dados do dono do ativo
        asset_owner_name: "João da Silva",
        asset_owner_email: "joao.silva@cliente.com.br",
        asset_owner_phone: "(11) 98765-4321",
        asset_owner_department: "TI",
        
        // Dados de monitoramento
        monitoring_tool: "Zabbix",
        monitoring_url: "https://zabbix.empresa.com.br",
        
        // Dados de atendimento presencial
        onsite_support_available: true,
        onsite_support_address: "Av. Paulista, 1000, São Paulo, SP",
        onsite_support_contact: "Maria Souza (11) 99999-8888",
        onsite_support_schedule: "8x5 (dias úteis, 9h às 18h)"
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
    
    // Criar localizações de exemplo
    this.createLocation({
      client_id: 1, // Acme Corp
      name: "Sede Principal",
      description: "Sede principal da Acme Corp",
      location_type: "matriz",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      postal_code: "01310-100",
      primary_contact_name: "João Silva",
      primary_contact_email: "joao@acmecorp.com",
      primary_contact_phone: "(11) 3333-4444",
      has_onsite_support: true,
      onsite_support_hours: "8x5 (9h às 18h)",
      onsite_support_details: "Suporte técnico disponível em horário comercial"
    });
    
    this.createLocation({
      client_id: 4, // TechFibra
      name: "Data Center Principal",
      description: "Data center principal da TechFibra",
      location_type: "datacenter",
      address: "Rua Tecnologia, 500",
      city: "São Paulo",
      state: "SP",
      postal_code: "04542-000",
      primary_contact_name: "Roberta Técnica",
      primary_contact_email: "datacenter@techfibra.com",
      primary_contact_phone: "(11) 4444-5555",
      has_onsite_support: true,
      onsite_support_hours: "24x7",
      onsite_support_details: "Acesso restrito com autorização prévia, técnicos disponíveis em regime 24x7"
    });
    
    // Usar o cliente TechFibra existente (ID 4) para adicionar contrato e matriz de ativos completa
    this.getClient(4).then((client) => {
      if (!client) {
        console.error("Cliente TechFibra não encontrado");
        return;
      }
      // Criar um contrato ativo para o cliente
      this.createContract({
        client_id: client.id,
        name: "Contrato VIP - Gerenciamento Completo",
        status: "active",
        start_date: new Date(),
        end_date: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 anos
        renewal_type: "automatic",
        description: "Contrato Premium com suporte completo N1, N2 e N3, incluindo atendimento presencial",
        technical_contact: "Marina Costa",
        commercial_contact: "Roberto Vieira"
      }).then((contract) => {
        // Criar uma matriz de ativos completa para este contrato
        this.createAssetMatrix({
          contract_id: contract.id,
          name: "Matriz TechFibra - Sistemas Críticos",
          description: "Matriz completa para gerenciamento de infraestrutura crítica de telecom",
          
          // Dados de Suporte N1 - Detalhados
          support_n1_name: "Equipe NOC - Nível 1",
          support_n1_email: "noc.n1@techfibra.com",
          support_n1_phone: "(11) 3522-7788",
          support_n1_schedule: "24x7x365",
          support_n1_response_time: "10 minutos",
          
          // Dados de Suporte N2 - Especialistas
          support_n2_name: "Equipe de Especialistas de Rede",
          support_n2_email: "especialistas@techfibra.com",
          support_n2_phone: "(11) 3522-7799",
          support_n2_schedule: "12x7 (8h às 20h)",
          support_n2_response_time: "30 minutos",
          
          // Dados de Suporte N3 - Engenharia
          support_n3_name: "Equipe de Engenharia de Telecom",
          support_n3_email: "engenharia@techfibra.com",
          support_n3_phone: "(11) 3522-7700",
          support_n3_schedule: "8x5 (9h às 18h)",
          support_n3_response_time: "2 horas",
          
          // Dados do dono do ativo
          asset_owner_name: "Departamento de TI - TechFibra",
          asset_owner_email: "ti@techfibra.com",
          asset_owner_phone: "(11) 3522-7701",
          asset_owner_department: "Tecnologia da Informação",
          
          // Dados de monitoramento
          monitoring_tool: "Zabbix Enterprise",
          monitoring_url: "https://zabbix.techfibra.net",
          monitoring_credentials: "Acesso via SSO",
          
          // Dados de atendimento presencial
          onsite_support_available: true,
          onsite_support_address: "Av. Paulista, 1000, 5º andar - São Paulo/SP",
          onsite_support_contact: "Gerência de Operações NOC",
          onsite_support_schedule: "8x5 (9h às 18h) + Plantão de emergência"
        }).then((matrix) => {
          // Criar ativos relacionados a esta matriz
          this.createAsset({
            name: "Roteador de Borda",
            type: "roteador",
            client_id: client.id,
            contract_id: contract.id,
            status: "active",
            criticality: "critical",
            hostname: "router-border-1",
            ip_address: "10.1.1.1",
            zabbix_id: "RTR-BRD-01"
          });
          
          this.createAsset({
            name: "Switch Core Principal",
            type: "switch",
            client_id: client.id,
            contract_id: contract.id,
            status: "active",
            criticality: "critical",
            hostname: "sw-core-01",
            ip_address: "10.1.1.10",
            zabbix_id: "SW-CORE-01"
          });
          
          this.createAsset({
            name: "Servidor de Gerenciamento",
            type: "servidor",
            client_id: client.id,
            contract_id: contract.id,
            status: "active",
            criticality: "high",
            hostname: "srv-mgmt-01",
            ip_address: "10.1.1.100",
            zabbix_id: "SRV-MGMT-01"
          });
          
          // Criar um alerta para um dos ativos
          this.createAlert({
            asset_id: 5, // Roteador de Borda
            severity: "medium",
            message: "Instabilidade na interface WAN detectada",
            status: "open"
          });
        });
      });
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
  
  // Métodos para gerenciamento de localizações
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async getLocationsByClient(clientId: number): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(location => location.client_id === clientId);
  }
  
  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.locationId++;
    const newLocation: Location = { 
      ...location, 
      id,
      created_at: new Date(),
      updated_at: new Date() 
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }
}

export class DatabaseStorage implements IStorage {
  // Implementação dos métodos de Usuários
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Implementação dos métodos de Clientes
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }
  
  // Implementação dos métodos de Contratos
  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contracts);
  }
  
  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }
  
  async getContractsByClient(clientId: number): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.client_id, clientId));
  }
  
  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values(contract).returning();
    return newContract;
  }
  
  // Implementação dos métodos de Ativos
  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets);
  }
  
  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }
  
  async getAssetsByClient(clientId: number): Promise<Asset[]> {
    return await db.select().from(assets).where(eq(assets.client_id, clientId));
  }
  
  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }
  
  // Implementação dos métodos de Alertas
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.created_at));
  }
  
  async getAlertsByAsset(assetId: number): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.asset_id, assetId)).orderBy(desc(alerts.created_at));
  }
  
  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }
  
  // Implementação dos métodos de Chamados
  async getTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.created_at));
  }
  
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }
  
  async getTicketsByAsset(assetId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.asset_id, assetId)).orderBy(desc(tickets.created_at));
  }
  
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }
  
  // Implementação dos métodos de Atividades
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.created_at));
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
  
  // Implementação dos métodos de Integrações
  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations);
  }
  
  async getIntegration(id: number): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration;
  }
  
  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const [newIntegration] = await db.insert(integrations).values(integration).returning();
    return newIntegration;
  }
  
  // Implementação dos métodos de Matriz de Ativos
  async getAssetMatrices(): Promise<AssetMatrix[]> {
    return await db.select().from(assetMatrices);
  }
  
  async getAssetMatrix(id: number): Promise<AssetMatrix | undefined> {
    const [matrix] = await db.select().from(assetMatrices).where(eq(assetMatrices.id, id));
    return matrix;
  }
  
  async getAssetMatrixByContract(contractId: number): Promise<AssetMatrix | undefined> {
    const [matrix] = await db.select().from(assetMatrices).where(eq(assetMatrices.contract_id, contractId));
    return matrix;
  }
  
  async createAssetMatrix(assetMatrix: InsertAssetMatrix): Promise<AssetMatrix> {
    const [newMatrix] = await db.insert(assetMatrices).values(assetMatrix).returning();
    return newMatrix;
  }
  
  // Implementação dos métodos de Localizações
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }
  
  async getLocationsByClient(clientId: number): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.client_id, clientId));
  }
  
  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }
}

// Usando o armazenamento em memória para desenvolvimento
export const storage = new MemStorage();

// Para usar o banco de dados PostgreSQL para persistência, descomente a linha abaixo
// export const storage = new DatabaseStorage();
