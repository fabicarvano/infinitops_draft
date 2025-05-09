import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  FileText, 
  Eye,
  Users,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: number;
  name: string;
  contracts: number;
  assets: number;
  status: "active" | "inactive";
}

interface ClientsCollapsibleListProps {
  clients: Client[];
  onOpenDetails: (clientId: number) => void;
  onOpenContractForm: (clientId: number) => void;
  onOpenClientForm: () => void;
}

export default function ClientsCollapsibleList({ 
  clients, 
  onOpenDetails, 
  onOpenContractForm,
  onOpenClientForm
}: ClientsCollapsibleListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtrar clientes com base nos filtros selecionados
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
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
          <div className="bg-blue-50 p-2 rounded-lg mr-3">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <h3 className="title text-lg">Lista de Clientes</h3>
          <Badge className="ml-3 bg-blue-100 text-blue-700">
            {filteredClients.length} clientes
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onOpenClientForm();
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
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
                  placeholder="Buscar clientes..."
                  className="w-full pl-9 border-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Users className="h-4 w-4 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
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
          
          {/* Tabela de clientes */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Contratos</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativos</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">#{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.contracts}</TableCell>
                    <TableCell>{client.assets}</TableCell>
                    <TableCell>
                      <Badge className={
                        client.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-slate-100 text-slate-700"
                      }>
                        {client.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(client.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        
                        {/* Botão para criar contrato - adequado ao status do cliente */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenContractForm(client.id);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          {client.status === "active" ? "Novo Contrato" : "Adicionar Contrato"}
                        </Button>
                      </div>
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