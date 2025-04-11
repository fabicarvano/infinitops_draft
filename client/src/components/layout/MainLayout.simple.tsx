import React, { useState, useEffect } from "react";
import SimpleSidebar from "./Sidebar.simple";
import SimpleHeader from "./Header.simple";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function SimpleMainLayout({ children }: MainLayoutProps) {
  // Estado local para controlar se a barra lateral está expandida ou não
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Estado para rastrear se estamos em uma tela pequena
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Função para alternar o estado da barra lateral
  const toggleSidebar = () => {
    console.log("Toggling sidebar, current state:", sidebarExpanded);
    setSidebarExpanded(prev => !prev);
  };
  
  // Detectar tamanho da tela no carregamento e em redimensionamentos
  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth <= 1366;
      setIsSmallScreen(smallScreen);
      
      // Em telas pequenas, mantenha a barra lateral fechada por padrão
      if (smallScreen && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    };
    
    // Verificar inicialmente
    checkScreenSize();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Limpar listener ao desmontar
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarExpanded]);
  
  // Passar o estado e a função de controle para os componentes filhos
  return (
    <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
      {/* Overlay para telas pequenas quando o menu está aberto */}
      {isSmallScreen && sidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={toggleSidebar}
        />
      )}
      
      <SimpleSidebar expanded={sidebarExpanded} />
      
      <main 
        className={`flex-1 transition-all duration-300 ${
          (isSmallScreen && sidebarExpanded) 
            ? 'ml-0' 
            : sidebarExpanded 
              ? 'ml-64' 
              : 'ml-16'
        }`}
      >
        <SimpleHeader toggleSidebar={toggleSidebar} sidebarExpanded={sidebarExpanded} />
        <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}