import React, { useState } from 'react';
import { useSidebar } from "@/hooks/use-sidebar";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";
import {
  PieChart,
  LayoutGrid,
  Users,
  AlertTriangle,
  Ticket,
  Settings,
  LogOut,
  Bell
} from "lucide-react";

export default function MobileSidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();
  const [open, setOpen] = useState(false);

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
    <div className="flex items-center px-3 py-4">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-green-600 to-green-400 h-8 w-8 rounded-lg flex items-center justify-center shadow-sm">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div className="ml-2">
          <h1 className="text-lg font-bold text-slate-800 leading-5">CCOCORE</h1>
          <p className="text-[10px] text-slate-500 leading-3">Centro de Controle Operacional</p>
        </div>
      </div>
    </div>
  );

  // Menu items
  const renderMenuItems = () => (
    <div className="px-3 py-2">
      {menuItems.map((item) => {
        const isActive = item.path === location || 
                         (location === "/dashboard" && item.path === "/");
        
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setOpen(false)}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start mb-1 ${
                isActive 
                ? "bg-green-50 text-green-700" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="mr-3">
                {React.cloneElement(item.icon, { 
                  className: isActive ? "text-green-600" : "text-slate-500" 
                })}
              </span>
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  const renderFooter = () => (
    <div className="mt-auto px-3 mb-4">
      <Separator className="my-4 bg-slate-200" />
      <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-red-500 hover:bg-red-50">
        <LogOut className="h-5 w-5 mr-3 text-slate-500" />
        Logout
      </Button>
    </div>
  );

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
      <SheetContent side="left" className="p-0 w-[250px] border-r border-slate-200">
        <div className="flex flex-col h-full">
          {renderLogo()}
          <Separator className="bg-slate-200" />
          {renderMenuItems()}
          {renderFooter()}
        </div>
      </SheetContent>
    </Sheet>
  );
}