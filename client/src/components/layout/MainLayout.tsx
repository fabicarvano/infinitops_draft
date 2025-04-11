import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/hooks/use-sidebar";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { collapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
      <Sidebar />
      <motion.main 
        className={`flex-1 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
        initial={false}
        animate={{
          marginLeft: collapsed ? "4rem" : "16rem"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
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
