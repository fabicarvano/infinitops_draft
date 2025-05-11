import AssetMatrixEditor from "@/components/matrices/AssetMatrixEditor";
import { useToast } from "@/hooks/use-toast";

interface AssetMatrixTabsProps {
  contractId: number;
  contractName?: string;
  isEdit?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export function AssetMatrixTabs({ 
  contractId, 
  contractName = "Contrato não encontrado", 
  isEdit = false,
  onSubmit,
  onCancel,
  initialData 
}: AssetMatrixTabsProps) {
  const { toast } = useToast();
  
  // Manipulador para salvar a matriz
  const handleSaveMatrix = (data: any) => {
    console.log("Dados da matriz para salvar:", data);
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast({
        title: "Matriz de ativos salva",
        description: "A matriz foi configurada com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
  };
  
  return (
    <div className="h-[90vh] flex flex-col overflow-hidden">
      <AssetMatrixEditor
        contractId={contractId}
        contractName={contractName}
        onSave={handleSaveMatrix}
        onCancel={onCancel}
        initialData={initialData}
      />
    </div>
  );
}