import type { Express } from "express";
import { createServer, type Server } from "http";
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
  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
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

  return httpServer;
}
