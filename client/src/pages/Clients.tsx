import { useState } from "react";
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
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ClientForm from "@/components/forms/ClientForm";
import ContractForm from "@/components/forms/ContractForm";
import ClientDetails from "@/components/details/ClientDetails";
import ContractDetails from "@/components/details/ContractDetails";
import ClientsCollapsibleList from "@/components/clients/ClientsCollapsibleList";

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

  // Dados de exemplo para clientes (como estado atualizável)
  const [clients, setClients] = useState([
    { id: 1, name: "Empresa ABC", contracts: 3, assets: 12, status: "active" },
    { id: 2, name: "Tech Solutions", contracts: 1, assets: 5, status: "active" },
    { id: 3, name: "Empresa XYZ", contracts: 2, assets: 8, status: "active" },
    { id: 4, name: "Global Services", contracts: 1, assets: 3, status: "inactive" },
    { id: 5, name: "Data Systems", contracts: 4, assets: 15, status: "active" },
  ]);

  // Níveis de atendimento possíveis
  type ServiceLevelType = "standard" | "premium" | "vip";

  // Dados de exemplo para contratos com datas próximas de vencimento
  const contracts = [
    { 
      id: 101, 
      name: "Suporte 24x7", 
      client: "Empresa ABC", 
      endDate: "13/04/2025", 
      status: "active",
      serviceLevel: "vip" as ServiceLevelType  // Nível VIP
    }, // Vence em 3 dias
    { 
      id: 102, 
      name: "Monitoramento", 
      client: "Tech Solutions", 
      endDate: "14/03/2024", 
      status: "active",  // Embora esteja marcado como ativo, aparecerá inativo por estar vencido
      serviceLevel: "premium" as ServiceLevelType  // Nível Premium
    }, // Já vencido
    { 
      id: 103, 
      name: "Backup & Recovery", 
      client: "Empresa XYZ", 
      endDate: "08/07/2025", 
      status: "active",
      serviceLevel: "standard" as ServiceLevelType  // Nível Standard
    }, // Vence em 89 dias
    { 
      id: 104, 
      name: "Consultoria", 
      client: "Global Services", 
      endDate: "04/11/2023", 
      status: "inactive", // Já estava marcado como inativo manualmente
      serviceLevel: "standard" as ServiceLevelType  // Nível Standard
    }, // Já vencido
    { 
      id: 105, 
      name: "Infraestrutura", 
      client: "Data Systems", 
      endDate: "19/04/2024", 
      status: "active", // Será mostrado como inativo automaticamente devido à data
      serviceLevel: "premium" as ServiceLevelType  // Nível Premium
    }, // Já vencido
    { 
      id: 106, 
      name: "Manutenção Preventiva", 
      client: "Empresa ABC", 
      endDate: "30/09/2025", 
      status: "pending", // Contrato pendente de ativação
      serviceLevel: "standard" as ServiceLevelType  // Nível Standard
    }, // Contrato pendente
  ];

  return (
    <div className="relative">
      <div className="mb-6">
        {/* Lista de Clientes com Interface Colapsável */}
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
        
        {/* Lista de Contratos */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-50 p-2 rounded-lg mr-3">
                <CalendarClock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="title text-lg">Lista de Contratos</h3>
            </div>
            {/* Botão "Novo Contrato" removido */}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Término</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Nível</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => {
                  const daysUntilExpiration = getDaysUntilExpiration(contract.endDate);
                  
                  // Determina o status do contrato com base na data de término
                  // Se o contrato estiver vencido (daysUntilExpiration <= 0), deve estar inativo
                  const effectiveStatus = daysUntilExpiration <= 0 
                    ? "inactive" 
                    : contract.status;
                  
                  // Determina o ícone de alerta baseado nos dias até o vencimento
                  let expirationAlert = null;
                  
                  if (daysUntilExpiration <= 3 && daysUntilExpiration > 0) {
                    // Vence em 3 dias ou menos: ícone vermelho
                    expirationAlert = (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Contrato vence em {daysUntilExpiration} {daysUntilExpiration === 1 ? 'dia' : 'dias'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else if (daysUntilExpiration <= 90 && daysUntilExpiration > 3) {
                    // Vence entre 4 e 90 dias: ícone laranja
                    expirationAlert = (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="h-5 w-5 text-orange-500 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Contrato vence em {daysUntilExpiration} dias</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else if (daysUntilExpiration <= 0) {
                    // Contrato já vencido: ícone vermelho com aviso
                    expirationAlert = (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-5 w-5 text-red-600 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Contrato vencido há {Math.abs(daysUntilExpiration)} {Math.abs(daysUntilExpiration) === 1 ? 'dia' : 'dias'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }
                  
                  return (
                    <TableRow key={contract.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <TableCell className="font-medium">CTR{contract.id.toString().padStart(6, '0')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {contract.name}
                          {expirationAlert}
                        </div>
                      </TableCell>
                      <TableCell>{contract.client}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>
                        <Badge className={
                          contract.serviceLevel === "vip" 
                            ? "bg-purple-100 text-purple-700"
                            : contract.serviceLevel === "premium"
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-slate-100 text-slate-700"
                        }>
                          {contract.serviceLevel === "vip" 
                            ? "VIP" 
                            : contract.serviceLevel === "premium" 
                            ? "Premium" 
                            : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          effectiveStatus === "active" 
                            ? "bg-green-100 text-green-700" 
                            : effectiveStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }>
                          {effectiveStatus === "active" 
                            ? "Ativo" 
                            : effectiveStatus === "pending"
                            ? "Pendente"
                            : "Inativo"}
                        </Badge>
                        {daysUntilExpiration <= 0 && contract.status !== "inactive" && (
                          <div className="text-xs text-gray-500 mt-1">
                            (Inativado automaticamente por vencimento)
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedContractId(contract.id);
                              setIsContractDetailsOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
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
              ? { ...client, status: "active" } 
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