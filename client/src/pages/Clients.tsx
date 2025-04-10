import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar clientes..."
            className="w-full pl-9 bg-slate-800 border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Clientes & Contratos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-400">
              Módulo de Clientes & Contratos em desenvolvimento...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
