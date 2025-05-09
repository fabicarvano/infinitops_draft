import { createContext, useContext, useState, useEffect, useCallback } from "react";

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
  // Tela pequena: 1024px para incluir tablets e smartphones
  const MOBILE_BREAKPOINT = 1024;
  
  // Verificar se é uma tela pequena - memoizado para consistência
  const isMobileScreen = useCallback(() => {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }, []);
  
  // Estado para controle do sidebar
  const [collapsed, setCollapsed] = useState(() => {
    // Em telas pequenas, iniciar com menu fechado
    return isMobileScreen();
  });
  
  // Estado para rastrear o tamanho da tela
  const [isSmallScreen, setIsSmallScreen] = useState(() => isMobileScreen());

  // Função para alternar sidebar - memoizada para evitar problemas de referência
  const toggleSidebar = useCallback(() => {
    console.log("toggleSidebar chamado, estado atual:", collapsed);
    setCollapsed(prevState => {
      const newState = !prevState;
      console.log("Novo estado do sidebar:", newState);
      return newState;
    });
  }, [collapsed]);

  // Função para definir estado explicitamente
  const setCollapsedState = useCallback((state: boolean) => {
    console.log("setCollapsedState chamado, novo estado:", state);
    setCollapsed(state);
  }, []);

  // Rastrear redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = isMobileScreen();
      
      // Atualizar estado de tamanho da tela
      setIsSmallScreen(smallScreen);
      
      // Em telas pequenas, fechar automaticamente o menu
      if (smallScreen && !collapsed) {
        setCollapsed(true);
      }
    };

    // Adicionar listener de redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Verificar o tamanho inicial da tela
    handleResize();
    
    // Limpar listener ao desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, isMobileScreen]);

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
