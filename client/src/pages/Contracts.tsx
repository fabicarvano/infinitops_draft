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

  // Carregar contratos da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter dados dos clientes e contratos
        const clientsResponse = await fetch('/api/clients').then(res => res.json());
        const contractsResponse = await fetch('/api/contracts').then(res => res.json());
        
        // Garantir que os dados são arrays
        const clients = Array.isArray(clientsResponse) ? clientsResponse : [];
        const contracts = Array.isArray(contractsResponse) ? contractsResponse : [];
        
        console.log('Clientes recebidos:', clients);
        console.log('Contratos recebidos:', contracts);
        
        // Mapear contratos para formato adequado para o componente
        const formattedContracts = contracts.map(contract => {
          // Encontrar nome do cliente pelo ID
          const client = clients.find(c => c.id === contract.client_id);
          const clientName = client ? client.name : `Cliente ID ${contract.client_id}`;
          
          // Formatar data de término para "YYYY-MM-DD" (formato esperado pelo componente)
          const endDate = new Date(contract.end_date);
          const formattedEndDate = format(endDate, "yyyy-MM-dd");
          
          // Determinar nível de serviço com base no nome do contrato
          let serviceLevel: "standard" | "premium" | "vip" = "standard";
          if (contract.name.toLowerCase().includes('premium')) {
            serviceLevel = "premium";
          } else if (contract.name.toLowerCase().includes('vip')) {
            serviceLevel = "vip";
          }
          
          return {
            id: contract.id,
            name: contract.name,
            client: clientName,
            endDate: formattedEndDate,
            status: contract.status as ContractStatus,
            serviceLevel: serviceLevel
          };
        });
        
        console.log('Contratos formatados:', formattedContracts);
        setContracts(formattedContracts);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar dados do servidor.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
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