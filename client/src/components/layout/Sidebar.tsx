import { useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2, 
  Server,
  Bell,
  TicketPlus,
  Settings,
  ChevronLeft, 
  ChevronRight,
  User,
  X
} from "lucide-react";

// Componente de navegação personalizado que também fechará o menu
function NavLink({ href, className, children }: { href: string, className: string, children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const { setCollapsedState } = useSidebar();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Fechamos o menu antes de navegar (sempre, independente do tamanho da tela)
    setCollapsedState(true);
    
    // Navegamos para a rota desejada
    setTimeout(() => {
      navigate(href);
    }, 10);
  };
  
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { collapsed, toggleSidebar, isSmallScreen } = useSidebar();

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

  // Variantes de animação com efeitos mais sutis
  const sidebarVariants = {
    expanded: { width: "16rem", x: 0 },
    collapsed: { width: "4rem", x: 0 }
  };
  
  // Efeito para garantir que o menu feche quando a janela for redimensionada para uma tela pequena
  useEffect(() => {
    if (isSmallScreen && !collapsed) {
      toggleSidebar();
    }
  }, [isSmallScreen, collapsed, toggleSidebar]);
  
  const logoVariants = {
    expanded: { 
      opacity: 1,
      x: 0,
      display: "flex"
    },
    collapsed: { 
      opacity: 0,
      x: -5,
      transitionEnd: { display: "none" }
    }
  };
  
  const navItemVariants = {
    expanded: (i: number) => ({
      opacity: 1, 
      x: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.15
      }
    }),
    collapsed: {
      opacity: 0,
      x: -5
    }
  };
  
  const profileTextVariants = {
    expanded: { 
      opacity: 1, 
      x: 0,
      display: "block" 
    },
    collapsed: { 
      opacity: 0, 
      x: -5,
      transitionEnd: { display: "none" }
    }
  };
  
  const notificationVariants = {
    initial: { scale: 0.9 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <>
      {/* Overlay para telas pequenas quando o menu está aberto */}
      {isSmallScreen && !collapsed && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={toggleSidebar}
        />
      )}
      
      <motion.aside 
        className="fixed h-screen z-20 shadow-md border-r border-slate-200"
        style={{ 
          background: "linear-gradient(180deg, rgba(25, 97, 39, 0.9) 0%, rgba(25, 97, 39, 0.7) 100%)"
        }}
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{
          type: "tween",
          duration: 0.25,
          ease: "easeOut"
        }}
      >
        <div 
          className="flex flex-col h-full overflow-hidden"
          onClick={() => {
            // Fechar a barra lateral ao clicar em qualquer área do menu
            if (isSmallScreen && !collapsed) {
              toggleSidebar();
            }
          }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/20">
            <motion.div 
              className="flex items-center space-x-3"
              variants={logoVariants}
              initial={false}
              animate={collapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.3 }}
            >
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-green-700 font-bold">
                CCO
              </div>
              <span className="font-semibold text-lg text-white whitespace-nowrap">Controle Operacional</span>
            </motion.div>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Impedir que o clique no botão dispare o onClick do container pai
                toggleSidebar();
              }}
              className="bg-white/20 text-white hover:bg-white/30 p-2 rounded-md cursor-pointer z-30"
              style={{ touchAction: "manipulation" }}
            >
              {/* Em telas pequenas, mostramos apenas o ícone de X para fechar, sem setas */}
              {isSmallScreen ? (
                !collapsed ? <X size={20} /> : null // Em telas pequenas, o botão não fica visível quando fechado
              ) : (
                // Em telas maiores, mantemos o comportamento original com setas
                collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />
              )}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4 flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin">
            <div className="py-1">
              {navItems.map((item, i) => (
                <NavLink 
                  key={item.path}
                  href={item.path}
                  className={`sidebar-link flex items-center px-3 py-2 rounded-xl mb-1 transition-all ${
                    isActive(item.path)
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="ml-3 whitespace-nowrap"
                        custom={i}
                        variants={navItemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.notification && (
                    <motion.div 
                      className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                      variants={notificationVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {item.notification}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-slate-200/20 p-4">
            <NavLink 
              href="/configuracoes"
              className="flex items-center cursor-pointer"
            >
              <motion.div 
                className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={16} />
              </motion.div>
              <motion.div 
                className="ml-3"
                variants={profileTextVariants}
                initial={false}
                animate={collapsed ? "collapsed" : "expanded"}
                transition={{ duration: 0.3 }}
              >
                <div className="font-medium text-white">Admin NOC</div>
                <div className="text-xs text-white/70">admin@ccocore.com</div>
              </motion.div>
            </NavLink>
          </div>
        </div>
      </motion.aside>
    </>
  );
}