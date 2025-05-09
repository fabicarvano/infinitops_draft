import React from 'react';
import { SidebarProvider } from "@/hooks/use-sidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen text-slate-800 overflow-x-hidden">
        {/* Sidebar Component */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          {/* Header Component */}
          <Header />
          
          {/* Page Content */}
          <div className="px-2 sm:px-4 md:px-6 py-3 md:py-4 overflow-x-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}