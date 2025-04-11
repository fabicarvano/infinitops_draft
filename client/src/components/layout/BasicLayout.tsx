import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  User,
  Menu,
  X,
  ChevronDown,
  MapPin
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Painel de Controle");
  const [currentCenter, setCurrentCenter] = useState("Centro de Operações SP");

  // Detectar tamanho da tela no carregamento e em redimensionamentos
  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth <= 1366;
      setIsSmallScreen(smallScreen);
      
      // Em telas pequenas, mantenha a barra lateral fechada por padrão
      if (smallScreen && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    // Verificar inicialmente
    checkScreenSize();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Limpar listener ao desmontar
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [menuOpen]);

  // Atualizar título da página com base na URL
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

  // Itens de navegação
  const navItems = [
    { 
      path: "/dashboard", 
      name: "Painel de Controle", 
      icon: LayoutDashboard 
    },
    { 
      path: "/clientes", 
      name: "Clientes & Contratos", 
      icon: Building2 
    },
    { 
      path: "/ativos", 
      name: "Ativos", 
      icon: Server 
    },
    { 
      path: "/alertas", 
      name: "Alertas", 
      icon: Bell,
      notification: 7
    },
    { 
      path: "/chamados", 
      name: "Chamados", 
      icon: TicketPlus,
      notification: 5
    },
    { 
      path: "/configuracoes", 
      name: "Configurações", 
      icon: Settings 
    },
  ];

  const isActive = (path: string) => {
    return location === path;
  };
  
  // Alternar menu
  const toggleMenu = () => {
    console.log("Toggling menu, current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
      {/* Overlay para telas pequenas quando o menu está aberto */}
      {isSmallScreen && menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed h-screen shadow-md border-r border-slate-200 bg-gradient-to-b from-green-800/90 to-green-700/70 z-30 transition-all duration-300 ease-out ${
          menuOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold">
                CCO
              </div>
              {menuOpen && (
                <span className="font-semibold text-lg text-white whitespace-nowrap">Controle Operacional</span>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="py-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-xl mb-1 transition-all ${
                    isActive(item.path)
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {menuOpen && (
                    <span className="ml-3 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  
                  {item.notification && (
                    <div className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {item.notification}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-slate-200/20 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-700">
                <User size={16} />
              </div>
              
              {menuOpen && (
                <div className="ml-3">
                  <div className="font-medium text-white">Admin NOC</div>
                  <div className="text-xs text-white/70">admin@ccocore.com</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ease-out ${
          (isSmallScreen && menuOpen) 
            ? 'ml-0' 
            : menuOpen 
              ? 'ml-64' 
              : 'ml-16'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 z-20 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-semibold text-slate-800">{pageTitle}</h1>
            </div>
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
        
        {/* Page Content */}
        <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}