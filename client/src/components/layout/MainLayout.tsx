import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/hooks/use-sidebar";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { collapsed, isSmallScreen } = useSidebar();
  
  return (
    <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
      <Sidebar />
      <motion.main 
        className="flex-1"
        initial={false}
        animate={{
          // Em telas pequenas, quando o menu estiver expandido, não mudamos a margem
          // para que o conteúdo fique embaixo do menu (sobreposição)
          marginLeft: (isSmallScreen && !collapsed) ? "0" : 
                     collapsed ? "4rem" : "16rem"
        }}
        transition={{
          type: "tween",
          duration: 0.25,
          ease: "easeOut"
        }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Header />
        </motion.div>
        <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
