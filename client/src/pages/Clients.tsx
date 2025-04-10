import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Building2, CalendarClock } from "lucide-react";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar clientes..."
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="title text-lg">Clientes</h3>
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
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500">
                Lista de clientes em desenvolvimento...
              </p>
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-50 p-2 rounded-lg mr-3">
                <CalendarClock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="title text-lg">Contratos</h3>
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
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500">
                Lista de contratos em desenvolvimento...
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="title text-lg">Detalhes do Cliente</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">
              Selecione um cliente para ver os detalhes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
