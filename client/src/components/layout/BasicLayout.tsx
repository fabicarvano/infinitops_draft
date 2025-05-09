import React from 'react';
import { SidebarProvider } from "@/hooks/use-sidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/hooks/use-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Componente interno que tem acesso ao contexto do Sidebar
function LayoutContent({ children }: LayoutProps) {
  const { collapsed, isSmallScreen } = useSidebar();
  
  // Calcular a margem dinamicamente com base no estado do sidebar e tamanho da tela
  // Em telas pequenas: sempre sem margem, pois o sidebar é um overlay
  // Em telas grandes: margem ajustada ao tamanho do sidebar (16px quando recolhido, 64px quando expandido)
  const mainMargin = isSmallScreen
    ? 'ml-0' // Em telas pequenas, sem margem independente do estado
    : (collapsed ? 'ml-16' : 'ml-64'); // Em telas grandes, margem se ajusta
  
  return (
    <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${mainMargin}`}>
        {/* Header Component */}
        <Header />
        
        {/* Page Content */}
        <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Componente principal que fornece o contexto do Sidebar
export default function BasicLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}