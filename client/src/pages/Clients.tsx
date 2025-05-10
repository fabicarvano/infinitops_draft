import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Search, 
  Building2, 
  CalendarClock, 
  Users,
  AlertTriangle,
  AlertCircle,
  Eye,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ClientForm from "@/components/forms/ClientForm";
import ContractForm from "@/components/forms/ContractForm";
import ClientDetails from "@/components/details/ClientDetails";
import ContractDetails from "@/components/details/ContractDetails";
import ClientsCollapsibleList from "@/components/clients/ClientsCollapsibleList";
import ContractsCollapsibleList from "@/components/contracts/ContractsCollapsibleList";

export default function Clients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [selectedContractId, setSelectedContractId] = useState<number | undefined>(undefined);
  
  // Data atual para cálculo do vencimento dos contratos
  const currentDate = new Date("2025-04-10"); // Usando a data atual do sistema
  
  // Função para calcular dias até o vencimento
  const getDaysUntilExpiration = (endDateStr: string) => {
    // Formato de data brasileiro: DD/MM/YYYY
    const [day, month, year] = endDateStr.split('/').map(num => parseInt(num));
    const endDate = new Date(year, month - 1, day); // Mês é 0-indexed em JavaScript
    
    const diffTime = endDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Modelo para clientes
  type ClientStatus = "active" | "inactive";
  
  interface ClientData {
    id: number;
    name: string;
    contracts: number;
    assets: number;
    status: ClientStatus;
  }
  
  // Estados para gerenciar clientes
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(true);
  
  // Carregar dados dos clientes do servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingClients(true);
        
        // Obter dados dos clientes, contratos e ativos
        const clientsResponse = await apiRequest('/api/clients');
        const contractsResponse = await apiRequest('/api/contracts');
        const assetsResponse = await apiRequest('/api/assets');
        
        // Garantir que os dados são arrays
        const clients = Array.isArray(clientsResponse) ? clientsResponse : [];
        const contracts = Array.isArray(contractsResponse) ? contractsResponse : [];
        const assets = Array.isArray(assetsResponse) ? assetsResponse : [];
        
        // Formatar dados para exibição
        const formattedClients = clients.map(client => {
          // Contar contratos e ativos para este cliente
          const clientContracts = contracts.filter(contract => contract.client_id === client.id);
          const clientAssets = assets.filter(asset => asset.client_id === client.id);
          
          return {
            id: client.id,
            name: client.name,
            contracts: clientContracts.length,
            assets: clientAssets.length,
            status: client.status as ClientStatus
          };
        });
        
        setClients(formattedClients);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar dados do servidor.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Níveis de atendimento possíveis
  type ServiceLevelType = "standard" | "premium" | "vip";
  type ContractStatus = "active" | "inactive" | "pending";

  // Dados de exemplo para contratos com datas próximas de vencimento
  const contracts: Array<{
    id: number;
    name: string;
    client: string;
    endDate: string;
    status: ContractStatus;
    serviceLevel: ServiceLevelType;
  }> = [
    { 
      id: 101, 
      name: "Suporte 24x7", 
      client: "Empresa ABC", 
      endDate: "13/04/2025", 
      status: "active",
      serviceLevel: "vip"  // Nível VIP
    }, // Vence em 3 dias
    { 
      id: 102, 
      name: "Monitoramento", 
      client: "Tech Solutions", 
      endDate: "14/03/2024", 
      status: "active",  // Embora esteja marcado como ativo, aparecerá inativo por estar vencido
      serviceLevel: "premium"  // Nível Premium
    }, // Já vencido
    { 
      id: 103, 
      name: "Backup & Recovery", 
      client: "Empresa XYZ", 
      endDate: "08/07/2025", 
      status: "active",
      serviceLevel: "standard"  // Nível Standard
    }, // Vence em 89 dias
    { 
      id: 104, 
      name: "Consultoria", 
      client: "Global Services", 
      endDate: "04/11/2023", 
      status: "inactive", // Já estava marcado como inativo manualmente
      serviceLevel: "standard"  // Nível Standard
    }, // Já vencido
    { 
      id: 105, 
      name: "Infraestrutura", 
      client: "Data Systems", 
      endDate: "19/04/2024", 
      status: "active", // Será mostrado como inativo automaticamente devido à data
      serviceLevel: "premium"  // Nível Premium
    }, // Já vencido
    { 
      id: 106, 
      name: "Manutenção Preventiva", 
      client: "Empresa ABC", 
      endDate: "30/09/2025", 
      status: "pending", // Contrato pendente de ativação
      serviceLevel: "standard"  // Nível Standard
    }, // Contrato pendente
  ];

  return (
    <div className="relative">
      <div className="mb-6">
        {/* Lista de Clientes com Interface Colapsável */}
        {isLoadingClients ? (
          <div className="card p-8 mb-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mr-2" />
            <span className="text-green-700 font-medium">Carregando clientes...</span>
          </div>
        ) : (
          <ClientsCollapsibleList
            clients={clients}
            onOpenDetails={(clientId) => {
              setSelectedClientId(clientId);
              setIsClientDetailsOpen(true);
            }}
            onOpenContractForm={(clientId) => {
              setSelectedClientId(clientId);
              setIsContractFormOpen(true);
            }}
            onOpenClientForm={() => setIsClientFormOpen(true)}
          />
        )}
        
        {/* Lista de Contratos com Interface Colapsável */}
        <ContractsCollapsibleList
          contracts={contracts}
          getDaysUntilExpiration={getDaysUntilExpiration}
          onOpenDetails={(contractId) => {
            setSelectedContractId(contractId);
            setIsContractDetailsOpen(true);
          }}
          onManageMatrix={(contractId, hasMatrix) => {
            // Redirecionar para a página de matriz de ativos com parâmetros
            window.location.href = `/ativos/matriz?contractId=${contractId}&edit=${hasMatrix ? 'true' : 'false'}`;
          }}
        />
      </div>

      {/* Formulários em modais */}
      <ClientForm 
        open={isClientFormOpen} 
        onOpenChange={setIsClientFormOpen} 
        onClientCreated={(client) => {
          console.log("Cliente criado:", client);
          // Em um app real, atualizaríamos a lista de clientes
        }}
      />

      <ContractForm 
        open={isContractFormOpen} 
        onOpenChange={setIsContractFormOpen}
        onContractCreated={(contract) => {
          console.log("Contrato criado:", contract);
          // Em um app real, atualizaríamos a lista de contratos
        }}
        clientId={selectedClientId} // Passa o ID do cliente selecionado
        onClientActivated={(clientId) => {
          console.log("Ativando cliente:", clientId);
          // Em um app real, chamaríamos uma API para ativar o cliente
          // Para simular, vamos buscar o cliente na lista e ativar localmente
          // Na implementação real, este código estaria no servidor
          const updatedClients = clients.map(client => 
            client.id === clientId 
              ? { ...client, status: "active" as const } 
              : client
          );
          
          // Atualizamos o estado local com os clientes modificados
          setClients(updatedClients);
          
          // Mostramos uma mensagem para o usuário
          toast({
            title: "Cliente ativado",
            description: `Cliente #${clientId} foi ativado automaticamente ao criar o contrato.`,
            className: "bg-green-50 border-green-200 text-green-800",
          });
        }}
      />

      {/* Detalhes em modais */}
      <ClientDetails 
        open={isClientDetailsOpen}
        onOpenChange={setIsClientDetailsOpen}
        clientId={selectedClientId}
      />

      <ContractDetails
        open={isContractDetailsOpen}
        onOpenChange={setIsContractDetailsOpen}
        contractId={selectedContractId}
      />
    </div>
  );
}