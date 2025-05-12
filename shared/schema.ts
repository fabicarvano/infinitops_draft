import { pgTable, text, serial, integer, boolean, timestamp, varchar, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  technical_contact: text("technical_contact"),
  commercial_contact: text("commercial_contact"),
  renewal_type: text("renewal_type").notNull(),
  service_level_type: text("service_level_type").notNull().default("standard"), // platinum, premium, standard, custom
  service_level_agreement: text("service_level_agreement"), // JSON com matriz de SLA para diferentes níveis de criticidade
  use_business_criticality_adjustment: boolean("use_business_criticality_adjustment").notNull().default(true), // Switch para habilitar/desabilitar ajuste por criticidade
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull().references(() => clients.id),
  contract_id: integer("contract_id").notNull().references(() => contracts.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  ip_address: text("ip_address"),
  hostname: text("hostname"),
  criticality: text("criticality").notNull().default("medium"), // Criticidade técnica (herdada do alerta)
  business_criticality: text("business_criticality").notNull().default("3"), // Criticidade de negócio (0-5, onde 0 é crítico)
  status: text("status").notNull().default("active"),
  
  // Campos de localização física
  location: text("location"), // Descrição geral da localização
  data_center: text("data_center"), // Nome do data center
  building: text("building"), // Nome do prédio
  telecom_room: text("telecom_room"), // Identificação da sala
  rack: text("rack"), // Identificação do rack
  rack_position: text("rack_position"), // Posição em unidades (U)
  floor: text("floor"), // Andar do prédio
  address: text("address"), // Endereço completo
  branch: text("branch"), // Identificação da filial/matriz
  
  zabbix_id: text("zabbix_id"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  asset_id: integer("asset_id").notNull().references(() => assets.id),
  severity: text("severity").notNull(), // critical, high, medium, low
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  
  // Campos para status do monitoramento
  monitoring_status: text("monitoring_status").notNull().default("ativo"), // ativo, normalizado, flapping, reconhecido, suprimido
  monitoring_source: text("monitoring_source"), // Zabbix, Nagios, etc.
  monitoring_id: text("monitoring_id"), // ID do alerta no sistema de monitoramento
  
  // Campos para SLA e prioridade
  technical_criticality: text("technical_criticality"), // Disaster, High, Average, Warning, Information
  final_priority: text("final_priority"), // Crítica, Muito Alta, Alta, Média, Baixa, Muito Baixa
  
  // Campos para tempos ajustados
  adjusted_response_time: integer("adjusted_response_time"), // Tempo de resposta após ajustes (minutos)
  adjusted_resolution_time: integer("adjusted_resolution_time"), // Tempo de resolução após ajustes (minutos)
  sla_deadline: timestamp("sla_deadline"), // Prazo final para resolução

  // Referência ao ticket
  ticket_id: integer("ticket_id").references(() => tickets.id),
  
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  asset_id: integer("asset_id").notNull().references(() => assets.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  
  // Campos para SLA efetivo
  final_priority: text("final_priority"), // Crítica, Muito Alta, Alta, Média, Baixa, Muito Baixa
  first_response_time: integer("first_response_time"), // Tempo base para primeiro atendimento (minutos)
  resolution_time: integer("resolution_time"), // Tempo base para resolução (minutos)
  first_response_deadline: timestamp("first_response_deadline"), // Prazo para primeiro atendimento
  resolution_deadline: timestamp("resolution_deadline"), // Prazo para resolução
  service_hours: text("service_hours"), // 24x7, Seg-Sex 06h-23h, Seg-Sex 09h-18h
  adjustment_factor: text("adjustment_factor").notNull().default("1.0"), // Fator de ajuste aplicado (0.5, 0.75, 0.9, 1.0)
  is_adjustment_enabled: boolean("is_adjustment_enabled").notNull().default(true), // Se o ajuste por criticidade está habilitado
  sla_paused: boolean("sla_paused").notNull().default(false), // Se o SLA está pausado
  sla_violated: boolean("sla_violated").notNull().default(false), // Se o SLA foi violado
  
  assignee_id: integer("assignee_id").references(() => users.id),
  created_by: integer("created_by").notNull().references(() => users.id),
  glpi_id: text("glpi_id"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  action_type: text("action_type").notNull(),
  resource_type: text("resource_type").notNull(),
  resource_id: integer("resource_id").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  config: text("config").notNull(),
  status: text("status").notNull().default("active"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Tabela para gerenciar localizações físicas
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  
  // Detalhes da localização
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").notNull().default("Brasil"),
  postal_code: text("postal_code"),
  
  // Tipo de localidade
  location_type: text("location_type").notNull(), // matriz, filial, datacenter, etc.
  
  // Contatos
  primary_contact_name: text("primary_contact_name"),
  primary_contact_email: text("primary_contact_email"),
  primary_contact_phone: text("primary_contact_phone"),
  
  emergency_contact_name: text("emergency_contact_name"),
  emergency_contact_email: text("emergency_contact_email"),
  emergency_contact_phone: text("emergency_contact_phone"),
  
  // Dados de suporte local
  has_onsite_support: boolean("has_onsite_support").notNull().default(false),
  onsite_support_hours: text("onsite_support_hours"),
  onsite_support_details: text("onsite_support_details"),
  
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const assetMatrices = pgTable("asset_matrices", {
  id: serial("id").primaryKey(),
  contract_id: integer("contract_id").notNull().references(() => contracts.id).unique(),
  name: text("name").notNull(),
  description: text("description"),
  
  // Suporte N1
  support_n1_name: text("support_n1_name"),
  support_n1_email: text("support_n1_email"),
  support_n1_phone: text("support_n1_phone"),
  support_n1_schedule: text("support_n1_schedule"),
  support_n1_response_time: text("support_n1_response_time"),
  support_n1_availability_type: text("support_n1_availability_type"), // "24x7", "comercial", "unificado", "sem_equipe"
  
  // Suporte N2
  support_n2_name: text("support_n2_name"),
  support_n2_email: text("support_n2_email"),
  support_n2_phone: text("support_n2_phone"),
  support_n2_schedule: text("support_n2_schedule"),
  support_n2_response_time: text("support_n2_response_time"),
  support_n2_availability_type: text("support_n2_availability_type"), // "24x7", "comercial", "unificado", "sem_equipe"
  
  // Suporte N3
  support_n3_name: text("support_n3_name"),
  support_n3_email: text("support_n3_email"),
  support_n3_phone: text("support_n3_phone"),
  support_n3_schedule: text("support_n3_schedule"),
  support_n3_response_time: text("support_n3_response_time"),
  support_n3_availability_type: text("support_n3_availability_type"), // "24x7", "comercial", "unificado", "sem_equipe"
  
  // Plantão unificado
  unified_support_name: text("unified_support_name"),
  unified_support_email: text("unified_support_email"),
  unified_support_phone: text("unified_support_phone"),
  unified_support_schedule: text("unified_support_schedule"),
  
  // Contato de emergência
  emergency_contact_name: text("emergency_contact_name"),
  emergency_contact_phone: text("emergency_contact_phone"),
  emergency_contact_email: text("emergency_contact_email"),
  emergency_instructions: text("emergency_instructions"),
  
  // Dados do dono do ativo
  asset_owner_name: text("asset_owner_name"),
  asset_owner_email: text("asset_owner_email"),
  asset_owner_phone: text("asset_owner_phone"),
  asset_owner_department: text("asset_owner_department"),
  
  // Campos removidos: Responsáveis de negócio (business_contact_*)
  
  // Campos removidos: Dados de monitoramento (monitoring_*)
  
  // Dados de atendimento presencial
  onsite_support_available: boolean("onsite_support_available"),
  onsite_support_address: text("onsite_support_address"),
  onsite_support_contact: text("onsite_support_contact"),
  onsite_support_schedule: text("onsite_support_schedule"),
  
  // Matriz de criticidade - Armazenada como string JSON
  criticality_matrix: text("criticality_matrix"),
  
  // Regras de escalação - Armazenada como string JSON
  escalation_rules: text("escalation_rules"),
  
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  created_at: true
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertAssetMatrixSchema = createInsertSchema(assetMatrices).omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;

export type InsertAssetMatrix = z.infer<typeof insertAssetMatrixSchema>;
export type AssetMatrix = typeof assetMatrices.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
