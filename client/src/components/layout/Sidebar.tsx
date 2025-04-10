import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();

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
      icon: TicketPlus 
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

  return (
    <aside 
      className={`fixed h-screen transition-all duration-300 z-20 bg-dark-900 border-r border-slate-800 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className={`flex items-center space-x-3 ${collapsed ? 'hidden' : 'block'}`}>
            <div className="h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold">
              CCO
            </div>
            <span className="font-semibold text-lg">CCOCORE</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          <div className="py-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md mb-1 ${
                  isActive(item.path)
                    ? 'bg-primary-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className={`transition-opacity ${collapsed ? 'hidden' : 'block'}`}>
                  {item.name}
                </span>
                {item.notification && (
                  <div className={`bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ${collapsed ? 'ml-auto' : 'ml-auto'}`}>
                    {item.notification}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <User size={16} />
            </div>
            <div className={`ml-3 ${collapsed ? 'hidden' : 'block'}`}>
              <div className="font-medium">Admin NOC</div>
              <div className="text-xs text-slate-400">admin@ccocore.com</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
