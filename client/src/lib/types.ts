export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Client {
  id: number;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: number;
  clientId: number;
  name: string;
  description?: string;
  status: "active" | "inactive" | "pending";
  startDate: string;
  endDate: string;
  technicalContact?: string;
  commercialContact?: string;
  renewalType: "client" | "internal" | "business";
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: number;
  clientId: number;
  contractId: number;
  name: string;
  type: string;
  ipAddress?: string;
  hostname?: string;
  criticality: "low" | "medium" | "high" | "critical";
  status: "active" | "inactive" | "maintenance";
  zabbixId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: number;
  assetId: number;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  status: "open" | "acknowledged" | "closed";
  createdAt: string;
  updatedAt: string;
  ticketId?: number;
}

export interface Ticket {
  id: number;
  assetId: number;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  assigneeId?: number;
  createdBy: number;
  glpiId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  userId?: number;
  actionType: string;
  resourceType: string;
  resourceId: number;
  description: string;
  createdAt: string;
}

export interface Integration {
  id: number;
  name: string;
  type: "zabbix" | "glpi" | "n8n" | "pabx";
  config: string;
  status: "active" | "inactive" | "error";
  createdAt: string;
  updatedAt: string;
}
