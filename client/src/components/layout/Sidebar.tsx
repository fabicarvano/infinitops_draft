import { useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  ChevronLeft, 
  ChevronRight,
  User,
} from "lucide-react";

// Componente simplificado de navegação para evitar problemas de refresh
function NavLink({ href, className, children }: { href: string, className: string, children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { setCollapsedState, isSmallScreen } = useSidebar();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Em telas pequenas, fechamos o menu antes de navegar com delay
    if (isSmallScreen) {
      setTimeout(() => {
        setCollapsedState(true);
      }, 100); // Pequeno delay para garantir que a navegação ocorra primeiro
    }
    
    // Navegação simples e direta usando wouter
    navigate(href);
  };
  
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar, isSmallScreen } = useSidebar();

  // Define navigation items
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

  // Fechar automaticamente o menu em telas pequenas quando redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (isSmallScreen && !collapsed) {
        toggleSidebar();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSmallScreen, collapsed, toggleSidebar]);

  // Background com gradiente
  const bgStyle = {
    background: "linear-gradient(180deg, rgba(25, 97, 39, 0.9) 0%, rgba(25, 97, 39, 0.7) 100%)"
  };

  return (
    <>
      {/* Overlay para telas pequenas quando o menu está aberto */}
      {isSmallScreen && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
        />
      )}
      
      {/* Sidebar principal com classes CSS para animação */}
      <aside 
        className={`
          fixed h-screen z-20 shadow-md border-r border-slate-200
          transition-all duration-300 ease-in-out
          ${isSmallScreen ? 'w-64' : (collapsed ? 'w-16' : 'w-64')}
          ${collapsed && isSmallScreen ? '-translate-x-full' : 'translate-x-0'}
        `}
        style={bgStyle}
      >
        {/* Conteúdo do sidebar */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                CCO
              </div>
              {(!collapsed || isSmallScreen) && (
                <span className="font-semibold text-lg text-white whitespace-nowrap">Controle Operacional</span>
              )}
            </div>
            
            {/* Botão toggle apenas para desktop */}
            {!isSmallScreen && (
              <button 
                type="button"
                onClick={toggleSidebar}
                className="bg-white/20 text-white hover:bg-white/30 p-2 rounded-md cursor-pointer z-30"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="py-1">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path}
                  href={item.path}
                  className={`sidebar-link flex items-center px-3 py-2 rounded-xl mb-1 transition-all ${
                    isActive(item.path)
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {(!collapsed || isSmallScreen) && (
                    <span className="ml-3 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                  
                  {item.notification && (!collapsed || isSmallScreen) && (
                    <div className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {item.notification}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-slate-200/20 p-4">
            <NavLink 
              href="/configuracoes"
              className="flex items-center cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-700 flex-shrink-0">
                <User size={16} />
              </div>
              
              {(!collapsed || isSmallScreen) && (
                <div className="ml-3">
                  <div className="font-medium text-white">Admin NOC</div>
                  <div className="text-xs text-white/70">admin@ccocore.com</div>
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}