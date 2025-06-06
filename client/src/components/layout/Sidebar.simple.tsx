import React from 'react';
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  User
} from "lucide-react";

interface SidebarProps {
  expanded: boolean;
}

export default function SimpleSidebar({ expanded }: SidebarProps) {
  const [location] = useLocation();

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

  return (
    <aside 
      className={`fixed h-screen z-20 bg-gradient-to-b from-green-800/90 to-green-700/70 shadow-md border-r border-slate-200 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Sidebar Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold">
              CCO
            </div>
            {expanded && (
              <span className="font-semibold text-lg text-white whitespace-nowrap">Controle Operacional</span>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto">
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
                
                {expanded && (
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
            
            {expanded && (
              <div className="ml-3">
                <div className="font-medium text-white">Admin NOC</div>
                <div className="text-xs text-white/70">admin@ccocore.com</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}