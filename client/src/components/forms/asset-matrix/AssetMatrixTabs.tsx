import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Esquema para validação do formulário - versão básica
const assetMatrixFormSchema = z.object({
  // Contrato (readonly)
  contractId: z.coerce.number(),
  
  // Seção 1: Dados de Ativos
  hostname: z.string().min(1, { message: "Hostname é obrigatório" }),
  ip: z.string().min(1, { message: "IP é obrigatório" }),
  tipo: z.string().min(1, { message: "Tipo é obrigatório" }),
  localizacao: z.string().optional(),
  datacenter: z.enum(["externo", "interno"]).optional(),
  edificio: z.string().optional(),
  salaDeRack: z.string().optional(),
  rack: z.string().optional(),
  posicaoRack: z.string().optional(),
  andar: z.string().optional(),
  endereco: z.string().optional(),
  unidade: z.string().optional(),
  
  // Seção 2: Dono do Ativo
  donoNome: z.string().min(1, { message: "Nome do responsável é obrigatório" }),
  donoTelefone: z.string().min(1, { message: "Telefone do responsável é obrigatório" }),
  donoEmail: z.string().email({ message: "Email inválido" }).min(1, { message: "Email é obrigatório" }),
  donoAcionar: z.string().min(1, { message: "Critérios de acionamento são obrigatórios" }),
  
  // Seção 3: Suporte N1
  n1Nome: z.string().optional(),
  n1Telefone: z.string().optional(),
  n1Email: z.string().email({ message: "Email inválido" }).optional(),
  n1Acionar: z.string().optional(),
  n1Descricao: z.string().optional(),
  
  // Seção 4: Suporte N2
  n2Nome: z.string().optional(),
  n2Telefone: z.string().optional(),
  n2Email: z.string().email({ message: "Email inválido" }).optional(),
  n2Acionar: z.string().optional(),
  n2Descricao: z.string().optional(),
  
  // Seção 5: Suporte N3
  n3Nome: z.string().optional(),
  n3Telefone: z.string().optional(),
  n3Email: z.string().email({ message: "Email inválido" }).optional(),
  n3Acionar: z.string().optional(),
  n3Descricao: z.string().optional(),
  
  // Seção 6: Acionamento Presencial
  presencialNome: z.string().optional(),
  presencialTelefone: z.string().optional(),
  presencialEmail: z.string().email({ message: "Email inválido" }).optional(),
  presencialAcionar: z.string().optional(),
  presencialDescricao: z.string().optional(),
  
  // Seção 7: Monitoramento (esses campos não aparecem na interface, serão preenchidos via API)
  // Não incluídos no formulário visível
});

type AssetMatrixFormValues = z.infer<typeof assetMatrixFormSchema>;

interface AssetMatrixTabsProps {
  contractId: number;
  contractName?: string;
  isEdit?: boolean;
  onSubmit?: (data: AssetMatrixFormValues) => void;
  onCancel?: () => void;
  initialData?: Partial<AssetMatrixFormValues>;
}

export function AssetMatrixTabs({ 
  contractId, 
  contractName = "Contrato não encontrado", 
  isEdit = false,
  onSubmit,
  onCancel,
  initialData 
}: AssetMatrixTabsProps) {
  const [activeTab, setActiveTab] = useState("dados-ativos");
  const { toast } = useToast();
  
  const defaultValues: Partial<AssetMatrixFormValues> = {
    contractId,
    hostname: "",
    ip: "",
    tipo: "",
    localizacao: "",
    datacenter: "interno",
    donoNome: "",
    donoTelefone: "",
    donoEmail: "",
    donoAcionar: "",
    ...initialData
  };
  
  const form = useForm<AssetMatrixFormValues>({
    resolver: zodResolver(assetMatrixFormSchema),
    defaultValues,
  });
  
  const handleSubmit = (values: AssetMatrixFormValues) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      console.log("Dados da matriz:", values);
      toast({
        title: "Matriz de ativos salva",
        description: "Os dados foram salvos com sucesso.",
      });
    }
  };
  
  const handleImportMatrix = () => {
    toast({
      title: "Importação de matriz",
      description: "Funcionalidade em desenvolvimento. Será implementada com o banco de dados.",
    });
  };
  
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="h-[85vh] flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold">
          {isEdit ? "Atualizar Matriz de Ativos" : "Cadastrar Matriz de Ativos"}
        </h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-1 overflow-hidden">
          {/* Conteúdo principal (lado esquerdo) */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            {/* Campo de Contrato (somente leitura) */}
            <Card className="mb-4">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="contractId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contrato</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          value={`#${contractId} - ${contractName}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Sistema de abas */}
            <Tabs value={activeTab} onValueChange={navigateToTab} className="w-full flex-1 flex flex-col">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="dados-ativos">Dados de Ativos</TabsTrigger>
                <TabsTrigger value="dono-ativo">Dono do Ativo</TabsTrigger>
                <TabsTrigger value="suporte-n1">Suporte N1</TabsTrigger>
                <TabsTrigger value="suporte-n2">Suporte N2</TabsTrigger>
                <TabsTrigger value="suporte-n3">Suporte N3</TabsTrigger>
                <TabsTrigger value="acionamento-presencial">Acionamento Presencial</TabsTrigger>
                <TabsTrigger value="monitoramento" disabled>Monitoramento</TabsTrigger>
              </TabsList>
            
            {/* Conteúdo da aba 1: Dados de Ativos */}
            <TabsContent value="dados-ativos" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>1. Dados de Ativos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hostname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hostname <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do servidor/equipamento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IP <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço IP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo do ativo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="servidor">Servidor</SelectItem>
                              <SelectItem value="router">Router</SelectItem>
                              <SelectItem value="switch">Switch</SelectItem>
                              <SelectItem value="storage">Storage</SelectItem>
                              <SelectItem value="impressora">Impressora</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="localizacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                            <Input placeholder="Descrição geral" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="datacenter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Center</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="externo">Externo</SelectItem>
                              <SelectItem value="interno">Interno</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="edificio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edifício</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do prédio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaDeRack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sala de Telecom</FormLabel>
                          <FormControl>
                            <Input placeholder="Identificação da sala" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rack</FormLabel>
                          <FormControl>
                            <Input placeholder="Identificação do rack" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="posicaoRack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posição no Rack</FormLabel>
                          <FormControl>
                            <Input placeholder="Posição em unidades (U)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="andar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Andar</FormLabel>
                          <FormControl>
                            <Input placeholder="Andar do prédio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidade/Filial</FormLabel>
                          <FormControl>
                            <Input placeholder="Identificação da filial" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button type="button" variant="outline" onClick={() => navigateToTab("dono-ativo")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 2: Dono do Ativo */}
            <TabsContent value="dono-ativo" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>2. Dono do Ativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="donoNome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa/equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="donoTelefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Número para contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="donoEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço de email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="donoAcionar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quando acionar <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o critério" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="horario-comercial">Horário comercial</SelectItem>
                              <SelectItem value="24x7">24x7</SelectItem>
                              <SelectItem value="noite">Noite</SelectItem>
                              <SelectItem value="plantao">Plantão</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => navigateToTab("dados-ativos")}>
                  Anterior
                </Button>
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n1")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 3: Suporte N1 */}
            <TabsContent value="suporte-n1" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>3. Suporte N1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n1Nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa/equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n1Telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Número para contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n1Email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço de email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n1Acionar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quando acionar</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o critério" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="horario-comercial">Horário comercial</SelectItem>
                              <SelectItem value="24x7">24x7</SelectItem>
                              <SelectItem value="noite">Noite</SelectItem>
                              <SelectItem value="plantao">Plantão</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="n1Descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Detalhes adicionais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => navigateToTab("dono-ativo")}>
                  Anterior
                </Button>
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n2")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 4: Suporte N2 */}
            <TabsContent value="suporte-n2" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>4. Suporte N2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n2Nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa/equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n2Telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Número para contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n2Email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço de email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n2Acionar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quando acionar</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o critério" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="horario-comercial">Horário comercial</SelectItem>
                              <SelectItem value="24x7">24x7</SelectItem>
                              <SelectItem value="noite">Noite</SelectItem>
                              <SelectItem value="plantao">Plantão</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="n2Descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Detalhes adicionais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n1")}>
                  Anterior
                </Button>
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n3")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 5: Suporte N3 */}
            <TabsContent value="suporte-n3" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>5. Suporte N3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n3Nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa/equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n3Telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Número para contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="n3Email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço de email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="n3Acionar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quando acionar</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o critério" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="horario-comercial">Horário comercial</SelectItem>
                              <SelectItem value="24x7">24x7</SelectItem>
                              <SelectItem value="noite">Noite</SelectItem>
                              <SelectItem value="plantao">Plantão</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="n3Descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Detalhes adicionais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n2")}>
                  Anterior
                </Button>
                <Button type="button" variant="outline" onClick={() => navigateToTab("acionamento-presencial")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 6: Acionamento Presencial */}
            <TabsContent value="acionamento-presencial" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>6. Acionamento Presencial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="presencialNome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa/equipe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="presencialTelefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="Número para contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="presencialEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço de email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="presencialAcionar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quando acionar</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o critério" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="horario-comercial">Horário comercial</SelectItem>
                              <SelectItem value="24x7">24x7</SelectItem>
                              <SelectItem value="noite">Noite</SelectItem>
                              <SelectItem value="plantao">Plantão</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="presencialDescricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Detalhes adicionais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="outline" onClick={() => navigateToTab("suporte-n3")}>
                  Anterior
                </Button>
                {/* Não tem próximo pois é a última aba visível */}
              </div>
            </TabsContent>
            
            {/* Conteúdo da aba 7: Monitoramento (desabilitado, será preenchido via API) */}
            <TabsContent value="monitoramento" className="border rounded-lg p-4">
              <Card>
                <CardHeader>
                  <CardTitle>7. Dados do Monitoramento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Essa seção será preenchida automaticamente via API externa.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          </div>
          
          {/* Painel lateral de Ativos */}
          <div className="w-[350px] border-l bg-gray-50 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-white">
              <h3 className="text-lg font-semibold mb-1">Ativos na Matriz</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total: <span className="font-medium">0</span></p>
                <Button type="button" size="sm" className="mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Adicionar Ativo
                </Button>
              </div>
            </div>
            
            {/* Lista de ativos adicionados */}
            <div className="flex-1 overflow-auto p-2">
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-gray-300 mb-4"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h.01"></path><path d="M2 8h20"></path></svg>
                <p className="font-medium mb-1">Nenhum ativo adicionado</p>
                <p className="text-sm">Adicione ativos usando o botão acima</p>
              </div>
            </div>
            
            {/* Barra de progresso */}
            <div className="p-4 border-t bg-white">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
              </div>
              <p className="text-xs text-gray-500">0% completo</p>
            </div>
            
            {/* Botões de ação */}
            <div className="p-4 border-t flex justify-between bg-white">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              
              <div className="space-x-2">
                {/* Botão de importar matriz (apenas no cadastro) */}
                {!isEdit && (
                  <Button type="button" variant="secondary" onClick={handleImportMatrix}>
                    Importar Matriz
                  </Button>
                )}
                
                <Button type="submit">
                  {isEdit ? "Atualizar Matriz" : "Salvar Matriz"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}