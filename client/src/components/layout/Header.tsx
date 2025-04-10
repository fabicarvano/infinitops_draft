import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bell, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("Painel de Controle");
  const [currentCenter, setCurrentCenter] = useState("Centro de Operações SP");

  useEffect(() => {
    // Set page title based on current location
    switch (location) {
      case "/":
      case "/dashboard":
        setPageTitle("Painel de Controle");
        break;
      case "/clientes":
        setPageTitle("Clientes & Contratos");
        break;
      case "/ativos":
        setPageTitle("Ativos");
        break;
      case "/alertas":
        setPageTitle("Alertas");
        break;
      case "/chamados":
        setPageTitle("Chamados");
        break;
      case "/configuracoes":
        setPageTitle("Configurações");
        break;
      default:
        setPageTitle("CCOCORE");
    }
  }, [location]);

  const operationCenters = [
    "Centro de Operações SP",
    "Centro de Operações RJ",
    "Centro de Operações BH"
  ];

  return (
    <header className="bg-white shadow-sm py-4 px-6 z-10 border-b border-slate-200">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-800">{pageTitle}</h1>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative border-slate-200">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border border-white"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 card shadow-lg border-0" align="end">
              <div className="space-y-4">
                <div className="font-semibold text-slate-800">Notificações</div>
                <Separator className="bg-slate-200" />
                <div className="text-sm text-slate-600 rounded-lg bg-red-50 p-3 border border-red-100">
                  <span className="font-medium text-red-600 block mb-1">Alertas Críticos</span>
                  Você possui 7 alertas críticos para analisar
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 text-sm text-slate-700 border-slate-200"
              >
                <MapPin className="h-4 w-4 text-green-600 mr-1" />
                <span>{currentCenter}</span>
                <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 card shadow-lg border-0" align="end">
              <div className="space-y-1">
                {operationCenters.map((center) => (
                  <Button
                    key={center}
                    variant={center === currentCenter ? "default" : "ghost"}
                    className={`w-full justify-start ${center === currentCenter ? 'bg-green-600 hover:bg-green-700' : 'text-slate-700 hover:text-slate-900'}`}
                    onClick={() => setCurrentCenter(center)}
                  >
                    {center}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
