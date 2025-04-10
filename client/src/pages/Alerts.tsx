import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar alertas..."
            className="w-full pl-9 bg-slate-800 border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 px-6 py-4">
          <CardTitle className="text-xl">Alertas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-400">
              Módulo de Alertas em desenvolvimento...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
