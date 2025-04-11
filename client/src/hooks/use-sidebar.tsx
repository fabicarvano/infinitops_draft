import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsedState: (state: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleSidebar: () => {},
  setCollapsedState: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  // Verificar se é uma tela pequena (largura <= 1366px para notebooks de 13-14")
  const isMobileScreen = () => window.innerWidth <= 1366;
  
  // Inicializar estado recolhido com base no tamanho da tela
  const [collapsed, setCollapsed] = useState(isMobileScreen());

  // Atualizar estado quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      // Se a tela for pequena, mantenha a barra lateral recolhida
      if (isMobileScreen()) {
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
    setCollapsed(prevState => !prevState);
  };

  const setCollapsedState = (state: boolean) => {
    setCollapsed(state);
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar, setCollapsedState }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
