import React from 'react';
import { useSidebar } from "@/hooks/use-sidebar";
import { Link, useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  LayoutGrid,
  Users,
  AlertTriangle,
  Ticket,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function DesktopSidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();

  // Menu items config
  const menuItems = [
    { path: "/", icon: <PieChart size={20} />, label: "Dashboard" },
    { path: "/ativos", icon: <LayoutGrid size={20} />, label: "Ativos" },
    { path: "/clientes", icon: <Users size={20} />, label: "Clientes" },
    { path: "/alertas", icon: <AlertTriangle size={20} />, label: "Alertas" },
    { path: "/chamados", icon: <Ticket size={20} />, label: "Chamados" },
    { path: "/configuracoes", icon: <Settings size={20} />, label: "Configurações" },
  ];

  // Logo e título da empresa
  const renderLogo = () => (
    <div className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-4`}>
      <div className={`flex ${collapsed ? 'flex-col' : 'items-center'}`}>
        <div className="bg-gradient-to-r from-green-600 to-green-400 h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
          <Bell className="h-6 w-6 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-2">
            <h1 className="text-lg font-bold text-slate-800 leading-5">CCOCORE</h1>
            <p className="text-[10px] text-slate-500 leading-3">Centro de Controle Operacional</p>
          </div>
        )}
      </div>
    </div>
  );

  // Menu items
  const renderMenuItems = () => (
    <div className={`${collapsed ? 'px-2' : 'px-4'} py-2`}>
      {menuItems.map((item) => {
        const isActive = item.path === location || 
                         (location === "/dashboard" && item.path === "/");
        
        return (
          <Link
            key={item.path}
            href={item.path}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start mb-1 ${
                collapsed ? 'px-2' : ''
              } ${
                isActive 
                ? "bg-green-50 text-green-700" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className={collapsed ? '' : 'mr-3'}>
                {React.cloneElement(item.icon, { 
                  className: isActive ? "text-green-600" : "text-slate-500" 
                })}
              </span>
              {!collapsed && item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  const renderFooter = () => (
    <div className={`mt-auto ${collapsed ? 'px-2' : 'px-4'} mb-4`}>
      <Separator className="my-4 bg-slate-200" />
      <Button variant="ghost" className={`w-full justify-start ${
        collapsed ? 'px-2' : ''
      } text-slate-600 hover:text-red-500 hover:bg-red-50`}>
        <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-slate-500`} />
        {!collapsed && "Logout"}
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSidebar();
        }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!collapsed && <span className="ml-1">Recolher</span>}
      </Button>
    </div>
  );

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } z-50 flex flex-col shadow-sm`}
    >
      {renderLogo()}
      <Separator className="bg-slate-200" />
      {renderMenuItems()}
      {renderFooter()}
    </aside>
  );
}