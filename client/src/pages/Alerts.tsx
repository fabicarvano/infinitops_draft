import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle, Bell, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar alertas..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card overflow-hidden border-l-4 border-l-red-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-700 mb-1">Crítico</Badge>
                  <h3 className="font-medium">2 alertas críticos</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam de atenção imediata
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
            >
              Ver alertas críticos
            </Button>
          </div>
        </div>
        
        <div className="card overflow-hidden border-l-4 border-l-yellow-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 mb-1">Médio</Badge>
                  <h3 className="font-medium">3 alertas de atenção</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam ser monitorados
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Ver alertas de atenção
            </Button>
          </div>
        </div>
        
        <div className="card overflow-hidden border-l-4 border-l-blue-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Badge className="bg-blue-100 text-blue-700 mb-1">Zabbix</Badge>
                  <h3 className="font-medium">Integração Zabbix</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Configuar integração com Zabbix
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Configurar integração
            </Button>
          </div>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Alertas Ativos</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
          >
            Atualizar
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">
              Lista de alertas em desenvolvimento...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
