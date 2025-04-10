import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/hooks/use-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { collapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-100">
      <Sidebar />
      <main 
        className={`flex-1 transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
