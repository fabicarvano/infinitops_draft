import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, PlusCircle, TicketPlus, Clock, CheckCircle2, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar chamados..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <TicketPlus className="h-5 w-5 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">5</Badge>
          </div>
          <h3 className="title text-lg mb-1">Em Aberto</h3>
          <p className="caption">Chamados que aguardam ação</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">3</Badge>
          </div>
          <h3 className="title text-lg mb-1">Em Progresso</h3>
          <p className="caption">Chamados em andamento</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">12</Badge>
          </div>
          <h3 className="title text-lg mb-1">Resolvidos</h3>
          <p className="caption">Chamados concluídos</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-purple-50 p-2 rounded-lg">
              <User2 className="h-5 w-5 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">4</Badge>
          </div>
          <h3 className="title text-lg mb-1">Meus Chamados</h3>
          <p className="caption">Atribuídos a você</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                <TicketPlus className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="title text-lg">Chamados Recentes</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
            >
              Ver todos
            </Button>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">
                Lista de chamados em desenvolvimento...
              </p>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="title text-lg">Integrações</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg border border-slate-200 flex items-center">
                <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-700 font-bold text-sm">Z</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Zabbix</p>
                  <p className="text-xs text-slate-500">Monitoramento</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Configurar
                </Button>
              </div>
              
              <div className="p-3 rounded-lg border border-slate-200 flex items-center">
                <div className="h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-bold text-sm">G</span>
                </div>
                <div>
                  <p className="text-sm font-medium">GLPI</p>
                  <p className="text-xs text-slate-500">Gerenciamento de ativos</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Configurar
                </Button>
              </div>
              
              <div className="p-3 rounded-lg border border-slate-200 flex items-center">
                <div className="h-8 w-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold text-sm">N</span>
                </div>
                <div>
                  <p className="text-sm font-medium">N8N</p>
                  <p className="text-xs text-slate-500">Automação</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Configurar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
