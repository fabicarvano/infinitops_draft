// Sistema simplificado de permissões para o CCO

// Tipo para papéis de usuário no sistema
export type UserRole = "operator" | "technician" | "manager" | "admin";

// Interface para recursos do sistema
export interface SystemResource {
  id: string;
  name: string;
  description: string;
}

// Interface de permissão
export interface Permission {
  resource: string;
  actions: ("view" | "create" | "edit" | "delete")[];
}

// Definição de recursos do sistema
export const SYSTEM_RESOURCES: SystemResource[] = [
  { id: "tickets", name: "Chamados", description: "Gestão de chamados de suporte" },
  { id: "clients", name: "Clientes", description: "Gestão de clientes" },
  { id: "assets", name: "Ativos", description: "Gestão de ativos de infraestrutura" },
  { id: "contracts", name: "Contratos", description: "Gestão de contratos" },
  { id: "alerts", name: "Alertas", description: "Gestão de alertas de monitoramento" },
  { id: "sla", name: "SLA", description: "Configuração de SLA e níveis de serviço" },
  { id: "users", name: "Usuários", description: "Gestão de usuários do sistema" },
  { id: "reports", name: "Relatórios", description: "Relatórios e dashboards" }
];

// Mapeamento de permissões por papel
const PERMISSIONS_BY_ROLE: Record<UserRole, Permission[]> = {
  "operator": [
    { resource: "tickets", actions: ["view", "create"] },
    { resource: "clients", actions: ["view"] },
    { resource: "assets", actions: ["view"] },
    { resource: "alerts", actions: ["view"] },
    { resource: "reports", actions: ["view"] }
  ],
  
  "technician": [
    { resource: "tickets", actions: ["view", "create", "edit"] },
    { resource: "clients", actions: ["view"] },
    { resource: "assets", actions: ["view"] },
    { resource: "contracts", actions: ["view"] },
    { resource: "alerts", actions: ["view", "edit"] },
    { resource: "reports", actions: ["view"] }
  ],
  
  "manager": [
    { resource: "tickets", actions: ["view", "create", "edit", "delete"] },
    { resource: "clients", actions: ["view", "create", "edit"] },
    { resource: "assets", actions: ["view", "create", "edit"] },
    { resource: "contracts", actions: ["view", "create", "edit"] },
    { resource: "alerts", actions: ["view", "create", "edit", "delete"] },
    { resource: "sla", actions: ["view", "edit"] },
    { resource: "users", actions: ["view"] },
    { resource: "reports", actions: ["view", "create"] }
  ],
  
  "admin": [
    { resource: "tickets", actions: ["view", "create", "edit", "delete"] },
    { resource: "clients", actions: ["view", "create", "edit", "delete"] },
    { resource: "assets", actions: ["view", "create", "edit", "delete"] },
    { resource: "contracts", actions: ["view", "create", "edit", "delete"] },
    { resource: "alerts", actions: ["view", "create", "edit", "delete"] },
    { resource: "sla", actions: ["view", "create", "edit", "delete"] },
    { resource: "users", actions: ["view", "create", "edit", "delete"] },
    { resource: "reports", actions: ["view", "create", "edit", "delete"] }
  ]
};

/**
 * Verifica se um usuário tem permissão para uma ação específica em um recurso
 * @param userRole Papel do usuário no sistema
 * @param resource ID do recurso do sistema
 * @param action Ação a ser verificada
 * @returns Booleano indicando se o usuário tem permissão
 */
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: "view" | "create" | "edit" | "delete"
): boolean {
  // Admins têm todas as permissões
  if (userRole === "admin") return true;
  
  // Encontra as permissões para o papel do usuário
  const rolePermissions = PERMISSIONS_BY_ROLE[userRole] || [];
  
  // Procura pela permissão específica
  const resourcePermission = rolePermissions.find(p => p.resource === resource);
  
  // Verifica se a ação está incluída nas permissões para o recurso
  return resourcePermission ? resourcePermission.actions.includes(action) : false;
}

/**
 * Retorna o nome amigável do papel de usuário
 * @param role Papel do usuário
 * @returns Nome amigável em português
 */
export function getRoleName(role: UserRole): string {
  switch (role) {
    case "operator":
      return "Operador";
    case "technician":
      return "Técnico";
    case "manager":
      return "Gerente";
    case "admin":
      return "Administrador";
    default:
      return role;
  }
}

/**
 * Obtém todas as permissões para um papel de usuário
 * @param role Papel do usuário
 * @returns Array de permissões
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return [...(PERMISSIONS_BY_ROLE[role] || [])];
}

/**
 * Obtém todos os recursos que um usuário pode acessar
 * @param role Papel do usuário
 * @returns Array de IDs de recursos
 */
export function getAccessibleResources(role: UserRole): string[] {
  const permissions = PERMISSIONS_BY_ROLE[role] || [];
  return permissions.map(p => p.resource);
}

/**
 * Verifica se um usuário tem permissão de administrador
 * @param role Papel do usuário
 * @returns Booleano indicando se é administrador
 */
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Verifica se um usuário tem permissão de gerente ou superior
 * @param role Papel do usuário
 * @returns Booleano indicando se é gerente ou superior
 */
export function isManagerOrAbove(role: UserRole): boolean {
  return role === "manager" || role === "admin";
}