import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  Menu,
  X,
  User,
} from "lucide-react";

// Componente de navegação para dispositivos móveis
export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();

  // Lista de navegação - mesma do sidebar normal para manter consistência
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

  // Função para lidar com a navegação em dispositivos móveis
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // Fechar o menu após navegar
  };

  return (
    <>
      {/* Botão hamburger fixo no header - usando o mesmo estilo do atual */}
      <button 
        className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Mobile: Abrindo/fechando menu");
          setIsOpen(!isOpen);
        }}
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Menu de navegação móvel - display condicional */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu drawer */}
          <div 
            className="fixed left-0 top-0 h-full w-64 z-40 shadow-xl"
            style={{ 
              background: "linear-gradient(180deg, rgba(25, 97, 39, 0.9) 0%, rgba(25, 97, 39, 0.7) 100%)"
            }}
          >
            {/* Cabeçalho do menu */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/20">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold">
                  CCO
                </div>
                <span className="font-semibold text-lg text-white">Controle Operacional</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Navegação */}
            <nav className="mt-4 px-2 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
              <div className="py-1">
                {navItems.map((item) => (
                  <a 
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-xl mb-1 transition-all ${
                      isActive(item.path)
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item.path);
                    }}
                  >
                    <div className="flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="ml-3 whitespace-nowrap">
                      {item.name}
                    </span>
                    {item.notification && (
                      <div className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                        {item.notification}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </nav>
            
            {/* Perfil do usuário */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/20 p-4">
              <a 
                href="/configuracoes"
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/configuracoes");
                }}
              >
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-700">
                  <User size={16} />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-white">Admin NOC</div>
                  <div className="text-xs text-white/70">admin@ccocore.com</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}