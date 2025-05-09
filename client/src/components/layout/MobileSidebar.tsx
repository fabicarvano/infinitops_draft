import React, { useState } from 'react';
import { useSidebar } from "@/hooks/use-sidebar";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, X, User } from "lucide-react";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  LogOut
} from "lucide-react";

export default function MobileSidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();
  const [open, setOpen] = useState(false);

  // Background com gradiente
  const bgStyle = {
    background: "linear-gradient(180deg, rgba(25, 97, 39, 0.9) 0%, rgba(25, 97, 39, 0.7) 100%)"
  };

  // Menu items config
  const menuItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Painel de Controle" },
    { path: "/ativos", icon: <Server size={20} />, label: "Ativos" },
    { path: "/clientes", icon: <Building2 size={20} />, label: "Clientes & Contratos" },
    { path: "/alertas", icon: <Bell size={20} />, label: "Alertas", notification: 7 },
    { path: "/chamados", icon: <TicketPlus size={20} />, label: "Chamados", notification: 5 },
    { path: "/configuracoes", icon: <Settings size={20} />, label: "Configurações" },
  ];

  // Logo e título da empresa
  const renderLogo = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/20">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold flex-shrink-0">
          CCO
        </div>
        <span className="font-semibold text-lg text-white whitespace-nowrap">Controle Operacional</span>
      </div>
    </div>
  );

  // Menu items
  const renderMenuItems = () => (
    <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
      <div className="py-1">
        {menuItems.map((item) => {
          const isActive = item.path === location || 
                          (location === "/dashboard" && item.path === "/");
          
          return (
            <div 
              key={item.path} 
              onClick={() => {
                setOpen(false);
                // Navegar diretamente para a página usando window.location
                window.location.href = item.path;
              }}
            >
              <div className={`sidebar-link flex items-center px-3 py-2 rounded-xl mb-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}>
                <div className="flex-shrink-0">
                  {React.cloneElement(item.icon, {})}
                </div>
                
                <span className="ml-3 whitespace-nowrap">
                  {item.label}
                </span>
                
                {item.notification && (
                  <div className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {item.notification}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );

  const renderFooter = () => {
    return (
      <div className="border-t border-slate-200/20 p-4">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => {
            setOpen(false);
            window.location.href = "/configuracoes";
          }}
        >
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-700 flex-shrink-0">
            <User size={16} />
          </div>
          
          <div className="ml-3">
            <div className="font-medium text-white">Admin NOC</div>
            <div className="text-xs text-white/70">admin@ccocore.com</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px] border-r border-slate-200" style={bgStyle}>
        <div className="flex flex-col h-full">
          {renderLogo()}
          <Separator className="bg-slate-200/20" />
          {renderMenuItems()}
          {renderFooter()}
        </div>
      </SheetContent>
    </Sheet>
  );
}