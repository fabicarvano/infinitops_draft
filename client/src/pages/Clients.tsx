import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Building2, CalendarClock, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para clientes
  const clients = [
    { id: 1, name: "Empresa ABC", contracts: 3, assets: 12, status: "active" },
    { id: 2, name: "Tech Solutions", contracts: 1, assets: 5, status: "active" },
    { id: 3, name: "Empresa XYZ", contracts: 2, assets: 8, status: "active" },
    { id: 4, name: "Global Services", contracts: 1, assets: 3, status: "inactive" },
    { id: 5, name: "Data Systems", contracts: 4, assets: 15, status: "active" },
  ];

  // Dados de exemplo para contratos
  const contracts = [
    { id: 101, name: "Suporte 24x7", client: "Empresa ABC", startDate: "01/01/2023", endDate: "31/12/2023", status: "active" },
    { id: 102, name: "Monitoramento", client: "Tech Solutions", startDate: "15/03/2023", endDate: "14/03/2024", status: "active" },
    { id: 103, name: "Backup & Recovery", client: "Empresa XYZ", startDate: "10/02/2023", endDate: "09/02/2024", status: "active" },
    { id: 104, name: "Consultoria", client: "Global Services", startDate: "05/05/2023", endDate: "04/11/2023", status: "inactive" },
    { id: 105, name: "Infraestrutura", client: "Data Systems", startDate: "20/04/2023", endDate: "19/04/2024", status: "active" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar clientes ou contratos..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Lista de Clientes */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="title text-lg">Lista de Clientes</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Exportar
          </Button>
        </div>
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
              {clients.map((client) => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Lista de Contratos */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-50 p-2 rounded-lg mr-3">
              <CalendarClock className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="title text-lg">Lista de Contratos</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Novo Contrato
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Início</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Término</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="font-medium">#{contract.id}</TableCell>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>
                    <Badge className={
                      contract.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-slate-100 text-slate-700"
                    }>
                      {contract.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
