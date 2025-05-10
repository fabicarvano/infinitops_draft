import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertClientSchema, 
  insertContractSchema, 
  insertAssetSchema, 
  insertAlertSchema, 
  insertTicketSchema, 
  insertActivitySchema,
  insertIntegrationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rotas de Usuários (Users)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  // Rotas de Clientes (Clients)
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar clientes" });
    }
  });
  
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar cliente" });
    }
  });
  
  // Rotas de Contratos (Contracts)
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar contratos" });
    }
  });
  
  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contrato não encontrado" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar contrato" });
    }
  });
  
  app.get("/api/clients/:clientId/contracts", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const contracts = await storage.getContractsByClient(clientId);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar contratos do cliente" });
    }
  });
  
  // Rotas de Ativos (Assets)
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ativos" });
    }
  });
  
  app.get("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getAsset(id);
      if (!asset) {
        return res.status(404).json({ message: "Ativo não encontrado" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ativo" });
    }
  });
  
  app.get("/api/clients/:clientId/assets", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assets = await storage.getAssetsByClient(clientId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar ativos do cliente" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Error fetching client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating client" });
    }
  });

  // Contracts routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contracts" });
    }
  });

  app.get("/api/clients/:clientId/contracts", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const contracts = await storage.getContractsByClient(clientId);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating contract" });
    }
  });

  // Assets routes
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assets" });
    }
  });

  app.get("/api/clients/:clientId/assets", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assets = await storage.getAssetsByClient(clientId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getAsset(id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Error fetching asset" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating asset" });
    }
  });

  // Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching alerts" });
    }
  });

  app.get("/api/assets/:assetId/alerts", async (req, res) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const alerts = await storage.getAlertsByAsset(assetId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating alert" });
    }
  });

  // Tickets routes
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });

  app.get("/api/assets/:assetId/tickets", async (req, res) => {
    try {
      const assetId = parseInt(req.params.assetId);
      const tickets = await storage.getTicketsByAsset(assetId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Error fetching ticket" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating ticket" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating activity" });
    }
  });

  // Integrations routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching integrations" });
    }
  });
  
  // Asset Matrices routes
  app.get("/api/asset-matrices", async (req, res) => {
    try {
      const matrices = await storage.getAssetMatrices();
      res.json(matrices);
    } catch (error) {
      res.status(500).json({ message: "Error fetching asset matrices" });
    }
  });
  
  app.get("/api/contracts/:contractId/asset-matrix", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const matrix = await storage.getAssetMatrixByContract(contractId);
      if (!matrix) {
        return res.status(404).json({ message: "Asset matrix not found for this contract" });
      }
      res.json(matrix);
    } catch (error) {
      res.status(500).json({ message: "Error fetching asset matrix" });
    }
  });
  
  app.post("/api/asset-matrices", async (req, res) => {
    try {
      const validatedData = insertAssetMatrixSchema.parse(req.body);
      const matrix = await storage.createAssetMatrix(validatedData);
      res.status(201).json(matrix);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset matrix data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating asset matrix" });
    }
  });

  app.get("/api/integrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const integration = await storage.getIntegration(id);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Error fetching integration" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating integration" });
    }
  });

  // Dashboard statistics endpoint
  app.get("/api/statistics", async (req, res) => {
    try {
      const clients = await storage.getClients();
      const assets = await storage.getAssets();
      const alerts = await storage.getAlerts();
      const tickets = await storage.getTickets();
      
      const stats = {
        totalClients: clients.filter(client => client.status === 'active').length,
        totalAssets: assets.filter(asset => asset.status === 'active').length,
        criticalAlerts: alerts.filter(alert => alert.severity === 'critical' && alert.status === 'open').length,
        openTickets: tickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress').length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Cliente conectado
  wss.on('connection', (ws) => {
    console.log('Cliente conectado ao WebSocket');

    // Enviar mensagem inicial
    const welcomeMessage = {
      type: 'connection',
      message: 'Conectado ao Servidor CCO',
      timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(welcomeMessage));

    // Lidar com mensagens recebidas
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Mensagem recebida:', data);

        // Responder de acordo com o tipo da mensagem
        switch (data.type) {
          case 'alert_ack':
            await handleAlertAcknowledgment(data.alertId, ws);
            break;
          case 'ticket_update': 
            await handleTicketUpdate(data.ticketId, data.status, ws);
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          default:
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Tipo de mensagem desconhecido',
              timestamp: new Date().toISOString()
            }));
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Erro ao processar mensagem',
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Lidar com conexão fechada
    ws.on('close', () => {
      console.log('Cliente desconectado do WebSocket');
    });
  });

  // Broadcast para todos os clientes conectados
  function broadcastMessage(message: any): void {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Handler para reconhecimento de alertas
  async function handleAlertAcknowledgment(alertId: number, ws: WebSocket): Promise<void> {
    try {
      const alert = await storage.getAlert(alertId);
      if (!alert) {
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Alerta não encontrado',
          alertId,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Atualizar status do alerta (isso seria implementado no storage)
      // await storage.updateAlertStatus(alertId, 'acknowledged');

      // Enviar confirmação
      ws.send(JSON.stringify({
        type: 'alert_ack_success',
        alertId,
        message: 'Alerta reconhecido com sucesso',
        timestamp: new Date().toISOString()
      }));

      // Broadcast da atualização para todos os clientes
      broadcastMessage({
        type: 'alert_updated',
        alertId,
        status: 'acknowledged',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao reconhecer alerta:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Erro ao reconhecer alerta',
        alertId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Handler para atualização de chamado
  async function handleTicketUpdate(ticketId: number, status: string, ws: WebSocket): Promise<void> {
    try {
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Chamado não encontrado',
          ticketId,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Atualizar status do chamado (isso seria implementado no storage)
      // await storage.updateTicketStatus(ticketId, status);

      // Enviar confirmação
      ws.send(JSON.stringify({
        type: 'ticket_update_success',
        ticketId,
        status,
        message: 'Status do chamado atualizado com sucesso',
        timestamp: new Date().toISOString()
      }));

      // Broadcast da atualização para todos os clientes
      broadcastMessage({
        type: 'ticket_updated',
        ticketId,
        status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Erro ao atualizar chamado',
        ticketId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Simular novos alertas a cada 30 segundos
  setInterval(async () => {
    try {
      // Criar um alerta simulado (na prática, isso viria de sistemas externos como Zabbix)
      const assets = await storage.getAssets();
      if (assets.length > 0) {
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const severities = ['low', 'medium', 'high', 'critical'];
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
        
        const newAlert = {
          assetId: randomAsset.id,
          severity: randomSeverity,
          message: `Alerta automático: ${randomSeverity === 'critical' ? 'CPU crítico' : 'Uso de memória alto'} em ${randomAsset.name}`,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const alert = await storage.createAlert(newAlert);
        
        // Broadcast do novo alerta
        broadcastMessage({
          type: 'new_alert',
          alert,
          timestamp: new Date().toISOString()
        });
        
        console.log('Novo alerta simulado enviado:', alert);
      }
    } catch (error) {
      console.error('Erro ao criar alerta simulado:', error);
    }
  }, 30000);
  
  // Simular abertura de chamados VIP ocasionalmente (a cada 15 segundos para teste)
  setInterval(async () => {
    try {
      // 40% de chance de gerar um novo chamado VIP
      if (Math.random() > 0.6) {
        const clients = await storage.getClients();
        if (clients.length > 0) {
          const randomClient = clients[Math.floor(Math.random() * clients.length)];
          const assets = await storage.getAssetsByClient(randomClient.id);
          
          if (assets.length > 0) {
            const randomAsset = assets[Math.floor(Math.random() * assets.length)];
            const ticketId = Math.floor(Math.random() * 1000) + 5000;
            
            // Broadcast do novo chamado VIP
            broadcastMessage({
              type: 'vip_ticket',
              ticketId,
              client: randomClient.name,
              asset: randomAsset.name,
              timestamp: new Date().toISOString()
            });
            
            console.log('Notificação de chamado VIP enviada:', { 
              ticketId, 
              client: randomClient.name,
              asset: randomAsset.name 
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao criar notificação de chamado VIP:', error);
    }
  }, 15000);

  return httpServer;
}
