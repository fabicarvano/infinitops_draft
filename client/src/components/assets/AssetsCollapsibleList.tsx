import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Building2, 
  FileText, 
  Ticket, 
  Check, 
  ArrowUpRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Asset {
  id: number;
  name: string;
  type: string;
  client: string;
  contract: string;
  status: "active" | "inactive" | "maintenance";
  criticality: "low" | "medium" | "high" | "critical";
  alertCount?: number;
  linkedTickets?: number[];
}

export default function AssetsCollapsibleList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dados de exemplo
  const assets: Asset[] = [
    {
      id: 1,
      name: "SRV-WEB-01",
      type: "Servidor",
      client: "Empresa ABC",
      contract: "Suporte 24x7",
      status: "active",
      criticality: "high",
      alertCount: 3,
      linkedTickets: [1001, 1002]
    },
    {
      id: 2,
      name: "FW-MAIN-01",
      type: "Firewall",
      client: "Tech Solutions",
      contract: "Monitoramento",
      status: "active",
      criticality: "medium",
      alertCount: 2,
      linkedTickets: [1003]
    },
    {
      id: 3,
      name: "DB-SQL-03",
      type: "Banco de Dados",
      client: "Empresa XYZ",
      contract: "Backup & Recovery",
      status: "active",
      criticality: "high",
      alertCount: 1,
      linkedTickets: [1004]
    },
    {
      id: 4,
      name: "STORAGE-01",
      type: "Storage",
      client: "Global Services",
      contract: "Consultoria",
      status: "maintenance",
      criticality: "critical",
      alertCount: 4,
      linkedTickets: [1005, 1006]
    },
    {
      id: 5,
      name: "RTR-CORE-01",
      type: "Roteador",
      client: "Empresa DEF",
      contract: "Infraestrutura",
      status: "active",
      criticality: "medium",
      alertCount: 0,
      linkedTickets: []
    },
    {
      id: 6,
      name: "SRV-MAIL-02",
      type: "Servidor",
      client: "Empresa ABC",
      contract: "Suporte 24x7",
      status: "inactive",
      criticality: "low",
      alertCount: 0,
      linkedTickets: []
    },
    {
      id: 7,
      name: "SW-FLOOR-02",
      type: "Switch",
      client: "Empresa JKL",
      contract: "Monitoramento",
      status: "active",
      criticality: "low",
      alertCount: 1,
      linkedTickets: [1007]
    }
  ];

  // Extrair clientes e contratos únicos para os filtros
  const clientsSet = new Set<string>();
  const contractsSet = new Set<string>();
  assets.forEach(asset => {
    clientsSet.add(asset.client);
    contractsSet.add(asset.contract);
  });
  const clients = Array.from(clientsSet);
  const contracts = Array.from(contractsSet);

  // Filtrar ativos com base nos filtros selecionados
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = clientFilter === "all" || asset.client === clientFilter;
    const matchesContract = contractFilter === "all" || asset.contract === contractFilter;
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    
    return matchesSearch && matchesClient && matchesContract && matchesStatus;
  });

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-slate-100 text-slate-700">Inativo</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-700">Manutenção</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Cabeçalho com botão para expandir/colapsar */}
      <div 
        className="px-5 py-4 border-b border-slate-100 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-lg mr-3">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <h3 className="title text-lg">Lista Completa de Ativos</h3>
          <Badge className="ml-3 bg-blue-100 text-blue-700">
            {filteredAssets.length} ativos
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
                  placeholder="Buscar ativos..."
                  className="w-full pl-9 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Clientes</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client} value={client}>{client}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <Select value={contractFilter} onValueChange={setContractFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Contratos</SelectItem>
                      {contracts.map(contract => (
                        <SelectItem key={contract} value={contract}>{contract}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Check className="h-4 w-4 text-slate-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="maintenance">Em Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabela de ativos */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Tipo</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Contrato</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Criticidade</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Alertas</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Chamados</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.client}</TableCell>
                    <TableCell>{asset.contract}</TableCell>
                    <TableCell>{getCriticalityBadge(asset.criticality)}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>
                      {asset.alertCount && asset.alertCount > 0 ? (
                        <Badge className="bg-red-100 text-red-700">
                          {asset.alertCount} {asset.alertCount === 1 ? 'alerta' : 'alertas'}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">Sem alertas</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.linkedTickets && asset.linkedTickets.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Ticket className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{asset.linkedTickets.length}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => window.location.href = `/ativos/${asset.id}`}
                      >
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}