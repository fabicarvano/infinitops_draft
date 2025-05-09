import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  FileText, 
  CalendarClock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type ServiceLevelType = "standard" | "premium" | "vip";
type ContractStatus = "active" | "inactive" | "pending";

interface Contract {
  id: number;
  name: string;
  client: string;
  endDate: string;
  status: ContractStatus;
  serviceLevel: ServiceLevelType;
}

interface ContractsCollapsibleListProps {
  contracts: Contract[];
  getDaysUntilExpiration: (endDateStr: string) => number;
  onOpenDetails: (contractId: number) => void;
}

export default function ContractsCollapsibleList({ 
  contracts, 
  getDaysUntilExpiration,
  onOpenDetails
}: ContractsCollapsibleListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtrar contratos com base nos filtros selecionados
  const filteredContracts = contracts.filter(contract => {
    const contractId = contract.id.toString();
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contractId.includes(searchTerm) || 
      contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const effectiveStatus = getDaysUntilExpiration(contract.endDate) <= 0 
      ? "inactive" 
      : contract.status;
    
    const matchesStatus = statusFilter === "all" || effectiveStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="card overflow-hidden mb-6">
      {/* Cabeçalho com botão para expandir/colapsar */}
      <div 
        className="px-5 py-4 border-b border-slate-100 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="bg-green-50 p-2 rounded-lg mr-3">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-green-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-green-600" />
            )}
          </div>
          <h3 className="title text-lg">Lista de Contratos</h3>
          <Badge className="ml-3 bg-green-100 text-green-700">
            {filteredContracts.length} contratos
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Ocultar" : "Mostrar"}
        </Button>
      </div>

      {/* Conteúdo colapsável */}
      {isExpanded && (
        <div>
          {/* Barra de filtros */}
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar contratos..."
                  className="w-full pl-9 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-grow"></div> {/* Espaçador */}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
              >
                Exportar
              </Button>
            </div>
          </div>
          
          {/* Tabela de contratos */}
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
                {filteredContracts.map((contract) => {
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
                            <AlertCircle className="h-5 w-5 text-orange-500 ml-2" />
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetails(contract.id);
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
      )}
    </div>
  );
}