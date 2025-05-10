import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { format, parseISO, differenceInDays } from "date-fns";
import { PlusCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import ContractsCollapsibleList from "@/components/contracts/ContractsCollapsibleList";
import ContractForm from "@/components/forms/ContractForm";
import ContractDetails from "@/components/details/ContractDetails";

// Tipos utilizados na página
type ContractStatus = "active" | "inactive" | "pending";

interface Contract {
  id: number;
  name: string;
  client: string;
  endDate: string;
  status: ContractStatus;
  serviceLevel: "standard" | "premium" | "vip";
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Carregar contratos (simulação)
  useEffect(() => {
    // Em um app real, isso seria uma chamada para API
    const mockContracts: Contract[] = [
      { 
        id: 1, 
        name: "Suporte 24x7", 
        client: "Tech Solutions", 
        endDate: "2025-12-23", 
        status: "active", 
        serviceLevel: "premium" 
      },
      { 
        id: 2, 
        name: "Monitoramento Preventivo", 
        client: "Empresa ABC", 
        endDate: "2025-09-30", 
        status: "pending",
        serviceLevel: "standard" 
      },
      { 
        id: 3, 
        name: "Backup & Recovery", 
        client: "Global Services", 
        endDate: "2025-05-15", 
        status: "active",
        serviceLevel: "vip" 
      },
      { 
        id: 4, 
        name: "Consultoria de Infraestrutura", 
        client: "Data Systems", 
        endDate: "2025-07-10", 
        status: "active",
        serviceLevel: "premium" 
      },
      { 
        id: 5, 
        name: "Monitoramento de Servidores", 
        client: "Empresa XYZ", 
        endDate: "2024-04-25", 
        status: "inactive",
        serviceLevel: "standard" 
      }
    ];
    
    setContracts(mockContracts);
  }, []);

  // Função para calcular dias até expiração
  const getDaysUntilExpiration = (endDateStr: string) => {
    try {
      // Para lidar com datas no formato 'YYYY-MM-DD'
      const endDate = parseISO(endDateStr);
      const today = new Date();
      return differenceInDays(endDate, today);
    } catch (error) {
      console.error("Erro ao calcular dias até expiração:", error);
      return 0;
    }
  };

  // Handler para abrir o detalhe do contrato
  const handleOpenContractDetails = (contractId: number) => {
    setSelectedContractId(contractId);
    setIsDetailModalOpen(true);
  };

  // Handler para criar um novo contrato
  const handleCreateContract = (contractData: any) => {
    // Em um app real, isso seria um POST para o backend
    const newContract: Contract = {
      id: contracts.length + 1,
      name: contractData.name,
      client: "Cliente do Contrato", // Isso viria do backend
      endDate: format(contractData.end_date, "yyyy-MM-dd"),
      status: contractData.status as ContractStatus,
      serviceLevel: contractData.service_level
    };
    
    setContracts([...contracts, newContract]);
    
    toast({
      title: "Contrato criado",
      description: `O contrato ${newContract.name} foi criado com sucesso.`,
    });
  };

  // Handler para gerenciar matriz de ativos
  const handleManageMatrix = (contractId: number, hasMatrix: boolean) => {
    // Redirecionar para a página de matriz de ativos com parâmetros
    setLocation(`/ativos/matriz?contractId=${contractId}&edit=${hasMatrix ? 'true' : 'false'}`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Contratos</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-700 hover:bg-green-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ContractsCollapsibleList 
          contracts={contracts}
          getDaysUntilExpiration={getDaysUntilExpiration}
          onOpenDetails={handleOpenContractDetails}
          onManageMatrix={handleManageMatrix}
        />
      </motion.div>

      {/* Modal para criar contrato */}
      <ContractForm 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onContractCreated={handleCreateContract}
      />

      {/* Modal para detalhes do contrato */}
      <ContractDetails
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        contractId={selectedContractId}
        getDaysUntilExpiration={getDaysUntilExpiration}
      />
    </motion.div>
  );
}