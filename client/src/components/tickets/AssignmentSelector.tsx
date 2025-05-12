import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, User } from "lucide-react";

// Tipos básicos para o componente
export type UserRole = "operator" | "technician" | "manager" | "admin";

interface SupportUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AssignmentSelectorProps {
  ticketId: number;
  currentAssignee?: SupportUser;
  disabled?: boolean;
  onAssign?: (ticketId: number, userId: number) => void;
  className?: string;
}

// Dados simulados para exemplo
const MOCK_USERS: SupportUser[] = [
  { id: 1, name: "João Silva", email: "joao@exemplo.com", role: "technician" },
  { id: 2, name: "Maria Santos", email: "maria@exemplo.com", role: "technician" },
  { id: 3, name: "Carlos Oliveira", email: "carlos@exemplo.com", role: "manager" },
  { id: 4, name: "Ana Pereira", email: "ana@exemplo.com", role: "operator" },
  { id: 5, name: "Roberto Costa", email: "roberto@exemplo.com", role: "technician" },
];

export function AssignmentSelector({
  ticketId,
  currentAssignee,
  disabled = false,
  onAssign,
  className = ""
}: AssignmentSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<SupportUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    currentAssignee?.id
  );
  
  const { toast } = useToast();
  
  // Simulando carregamento de usuários disponíveis
  useEffect(() => {
    // Em um cenário real, carregaria do backend
    setAvailableUsers(MOCK_USERS);
  }, []);
  
  // Função para lidar com a atribuição
  const handleAssign = () => {
    if (!selectedUserId) {
      toast({
        title: "Erro",
        description: "Selecione um usuário para atribuir o chamado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      if (onAssign) {
        onAssign(ticketId, selectedUserId);
      }
      
      const assignedUser = availableUsers.find(user => user.id === selectedUserId);
      
      toast({
        title: "Chamado Atribuído",
        description: `O chamado #${ticketId} foi atribuído para ${assignedUser?.name}.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  // Função para obter a cor do cargo
  const getRoleBadgeStyles = (role: UserRole) => {
    switch (role) {
      case "operator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technician":
        return "bg-green-100 text-green-800 border-green-200";
      case "manager":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };
  
  // Função para obter o nome do cargo em português
  const getRoleName = (role: UserRole) => {
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
  };
  
  // Obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {currentAssignee ? (
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
          <Avatar>
            {currentAssignee.avatar ? (
              <AvatarImage src={currentAssignee.avatar} alt={currentAssignee.name} />
            ) : (
              <AvatarFallback>{getInitials(currentAssignee.name)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{currentAssignee.name}</div>
            <div className="text-sm text-slate-500">{currentAssignee.email}</div>
          </div>
          <Badge variant="outline" className={getRoleBadgeStyles(currentAssignee.role)}>
            {getRoleName(currentAssignee.role)}
          </Badge>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <User className="h-5 w-5 text-amber-500" />
          <span className="text-amber-800">Chamado não atribuído</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Select
          value={selectedUserId?.toString()}
          onValueChange={(value) => setSelectedUserId(parseInt(value))}
          disabled={disabled}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Técnicos</SelectLabel>
              {availableUsers
                .filter(user => user.role === "technician")
                .map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Gerentes</SelectLabel>
              {availableUsers
                .filter(user => user.role === "manager")
                .map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Operadores</SelectLabel>
              {availableUsers
                .filter(user => user.role === "operator")
                .map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleAssign} 
          disabled={disabled || !selectedUserId || selectedUserId === currentAssignee?.id}
          size="icon"
        >
          {currentAssignee ? (
            <Check className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}