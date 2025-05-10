import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Clock, 
  BarChart3,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interface para os dados do cliente
interface ClientData {
  id: number;
  name: string;
  status: "active" | "inactive";
  email?: string;
  phone?: string;
  address?: string;
  contactName?: string;
  segment?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: number;
}

export default function ClientDetails({ open, onOpenChange, clientId }: ClientDetailsProps) {
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<ClientData | null>(null);
  const [contractCount, setContractCount] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [loading, setLoading] = useState(false);

  // Carregar dados do cliente quando o componente abrir
  useEffect(() => {
    if (open && clientId) {
      setLoading(true);
      
      // Carregar dados da API
      const fetchClientData = async () => {
        try {
          // Obter dados do cliente
          const clientResponse = await fetch(`/api/clients/${clientId}`).then(res => res.json());
          
          // Obter contratos deste cliente
          const contractsResponse = await fetch(`/api/contracts`).then(res => res.json());
          const clientContracts = Array.isArray(contractsResponse) 
            ? contractsResponse.filter(contract => contract.client_id === clientId)
            : [];
          
          // Obter ativos deste cliente
          const assetsResponse = await fetch(`/api/assets`).then(res => res.json());
          const clientAssets = Array.isArray(assetsResponse)
            ? assetsResponse.filter(asset => asset.client_id === clientId)
            : [];
          
          console.log('Detalhes do cliente:', clientResponse);
          console.log('Contratos do cliente:', clientContracts);
          console.log('Ativos do cliente:', clientAssets);
          
          // Atualizar estados
          setClient(clientResponse);
          setContractCount(clientContracts.length);
          setAssetCount(clientAssets.length);
          
          // Para tickets, poderíamos ter uma API específica, por enquanto mantemos o valor fixo
          setOpenTickets(Math.floor(Math.random() * 3) + 1); // Simulação: 1-3 tickets abertos
          
          setLoading(false);
        } catch (error) {
          console.error('Erro ao carregar dados do cliente:', error);
          setLoading(false);
        }
      };
      
      fetchClientData();
    } else {
      setClient(null);
    }
  }, [open, clientId]);

  if (!client && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto z-50 bg-white shadow-lg border">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-green-600" />
            {loading ? "Carregando..." : client?.name}
            {client?.status === "active" ? (
              <Badge className="ml-3 bg-green-100 text-green-700">Ativo</Badge>
            ) : (
              <Badge className="ml-3 bg-slate-100 text-slate-700">Inativo</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Detalhes e informações do cliente.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Carregando informações do cliente...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">CONTRATOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contractCount}</div>
                  <p className="text-xs text-slate-500 mt-1">2 ativos, 1 pendente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">ATIVOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assetCount}</div>
                  <p className="text-xs text-slate-500 mt-1">10 ativos, 2 em manutenção</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">CHAMADOS ABERTOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openTickets}</div>
                  <p className="text-xs text-slate-500 mt-1">1 crítico, 1 médio</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold">Informações Gerais</h3>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Email</div>
                      <div>{client?.email || "Não informado"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Telefone</div>
                      <div>{client?.phone || "Não informado"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Endereço</div>
                      <div>{client?.address || "Não informado"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-base font-semibold">Informações Adicionais</h3>
                  
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Contato Principal</div>
                      <div>{client?.contactName || "Não informado"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Segmento</div>
                      <div>{client?.segment || "Não informado"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-slate-700">Cliente desde</div>
                      <div>{new Date(client?.createdAt || "").toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-slate-500" />
                  Contratos
                </h3>
                
                <div className="text-sm">
                  <p className="text-slate-500">Este cliente possui {contractCount} contratos associados.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      onOpenChange(false); // Fechar o modal
                      setLocation(`/contratos?cliente=${clientId}`); // Redirecionar para a página de contratos com filtro
                    }}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ver contratos
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
              <Button className="bg-green-700 hover:bg-green-800">
                Editar Cliente
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}