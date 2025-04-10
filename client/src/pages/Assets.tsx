import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Server, Activity, HardDrive, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar ativos..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Ativo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <Server className="h-5 w-5 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">8 Total</Badge>
          </div>
          <h3 className="title text-lg mb-1">Servidores</h3>
          <p className="caption">Gerenciamento de servidores físicos e virtuais</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Network className="h-5 w-5 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">5 Total</Badge>
          </div>
          <h3 className="title text-lg mb-1">Rede</h3>
          <p className="caption">Firewalls, switches e roteadores</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <HardDrive className="h-5 w-5 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">3 Total</Badge>
          </div>
          <h3 className="title text-lg mb-1">Armazenamento</h3>
          <p className="caption">Soluções de storage e backup</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">2 Total</Badge>
          </div>
          <h3 className="title text-lg mb-1">Serviços</h3>
          <p className="caption">Aplicações e serviços monitorados</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-50 p-2 rounded-lg mr-3">
              <Server className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="title text-lg">Inventário de Ativos</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
          >
            Exportar
          </Button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">
              Lista de ativos em desenvolvimento...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
