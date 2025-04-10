import { pgTable, text, serial, integer, boolean, timestamp, varchar, numeric } from "drizzle-orm/pg-core";
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
  criticality: text("criticality").notNull().default("medium"),
  status: text("status").notNull().default("active"),
  zabbix_id: text("zabbix_id"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  asset_id: integer("asset_id").notNull().references(() => assets.id),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  ticket_id: integer("ticket_id").references(() => tickets.id),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  asset_id: integer("asset_id").notNull().references(() => assets.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
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
