import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsedState: (state: boolean) => void;
  isSmallScreen: boolean;
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleSidebar: () => {},
  setCollapsedState: () => {},
  isSmallScreen: false,
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  // Verificar se é uma tela pequena (largura <= 1024px para incluir tablets)
  // Ajustado para 1024px para pegar tanto celulares quanto tablets
  const isMobileScreen = () => window.innerWidth <= 1024;
  
  // Inicializar estado recolhido com base no tamanho da tela e rastrear o tamanho da tela
  const [collapsed, setCollapsed] = useState(isMobileScreen());
  const [isSmallScreen, setIsSmallScreen] = useState(isMobileScreen());

  // Atualizar estado quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = isMobileScreen();
      setIsSmallScreen(smallScreen);
      
      // Se a tela for pequena, mantenha a barra lateral recolhida
      if (smallScreen) {
        setCollapsed(true);
      }
    };

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Verificar no carregamento inicial
    handleResize();
    
    // Limpar listener quando componente for desmontado
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    // Removido log para reduzir ruído no console 
    // e garantir que não haja processamento adicional desnecessário
    setCollapsed(prevState => !prevState);
  };

  const setCollapsedState = (state: boolean) => {
    setCollapsed(state);
  };

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      toggleSidebar, 
      setCollapsedState,
      isSmallScreen 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
