import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bell } from "lucide-react";
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
    <header className="bg-dark-900 shadow-md py-4 px-6 z-10 border-b border-slate-800">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="font-medium">Notificações</div>
                <Separator />
                <div className="text-sm text-slate-400">
                  Você possui 7 alertas críticos para analisar
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-sm focus:outline-none"
              >
                <span>{currentCenter}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                {operationCenters.map((center) => (
                  <Button
                    key={center}
                    variant={center === currentCenter ? "secondary" : "ghost"}
                    className="w-full justify-start"
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
