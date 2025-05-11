import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Plus, 
  Trash2, 
  Info, 
  Edit2, 
  Save, 
  Server, 
  Database, 
  HardDrive,
  Network,
  Shield,
  Wifi,
  MonitorSmartphone,
  X
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Interface para a matriz de criticidade
interface Category {
  id: string;
  name: string;
  icon?: JSX.Element;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  business_criticality: number;
  description?: string;
}

// Props para o componente
interface CriticalityMatrixProps {
  initialMatrix?: {
    categories: Category[];
  };
  onSave?: (matrix: { categories: Category[] }) => void;
  readonly?: boolean;
}

// Função para obter o ícone por tipo de ativo
const getIconForCategory = (categoryId: string): JSX.Element => {
  switch (categoryId) {
    case 'servers':
      return <Server className="h-5 w-5" />;
    case 'databases':
      return <Database className="h-5 w-5" />;
    case 'storage':
      return <HardDrive className="h-5 w-5" />;
    case 'network':
      return <Network className="h-5 w-5" />;
    case 'security':
      return <Shield className="h-5 w-5" />;
    case 'wireless':
      return <Wifi className="h-5 w-5" />;
    case 'endpoints':
      return <MonitorSmartphone className="h-5 w-5" />;
    default:
      return <Server className="h-5 w-5" />;
  }
};

// Categoria e subcategorias padrão predefinidas
const defaultCategories: Category[] = [
  {
    id: 'servers',
    name: 'Servidores',
    icon: <Server className="h-5 w-5" />,
    subcategories: [
      { id: 'web-servers', name: 'Servidores Web', business_criticality: 3 },
      { id: 'app-servers', name: 'Servidores de Aplicação', business_criticality: 4 },
      { id: 'db-servers', name: 'Servidores de Banco de Dados', business_criticality: 5 }
    ]
  },
  {
    id: 'network',
    name: 'Rede',
    icon: <Network className="h-5 w-5" />,
    subcategories: [
      { id: 'switches', name: 'Switches', business_criticality: 4 },
      { id: 'routers', name: 'Roteadores', business_criticality: 5 },
      { id: 'load-balancers', name: 'Balanceadores de Carga', business_criticality: 4 }
    ]
  },
  {
    id: 'security',
    name: 'Segurança',
    icon: <Shield className="h-5 w-5" />,
    subcategories: [
      { id: 'firewalls', name: 'Firewalls', business_criticality: 5 },
      { id: 'ids-ips', name: 'IDS/IPS', business_criticality: 4 },
      { id: 'vpn', name: 'VPN', business_criticality: 3 }
    ]
  },
  {
    id: 'storage',
    name: 'Armazenamento',
    icon: <HardDrive className="h-5 w-5" />,
    subcategories: [
      { id: 'san', name: 'SAN', business_criticality: 5 },
      { id: 'nas', name: 'NAS', business_criticality: 4 },
      { id: 'backup', name: 'Backup', business_criticality: 3 }
    ]
  }
];

// Função para obter a cor de fundo baseada na criticidade
const getCriticalityColor = (criticality: number): string => {
  switch (criticality) {
    case 0:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    case 1:
      return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    case 2:
      return 'bg-green-100 hover:bg-green-200 text-green-800';
    case 3:
      return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
    case 4:
      return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
    case 5:
      return 'bg-red-100 hover:bg-red-200 text-red-800';
    default:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  }
};

// Descrições para cada nível de criticidade
const criticalityDescriptions = [
  "Sem impacto nos negócios. Falhas não afetam operações.",
  "Impacto mínimo. Afeta funções secundárias com alternativas disponíveis.",
  "Impacto moderado. Afeta funções importantes mas tem alternativas viáveis.",
  "Impacto significativo. Afeta processos essenciais com soluções de contorno limitadas.",
  "Impacto grave. Compromete funções críticas com perdas financeiras consideráveis.",
  "Impacto crítico. Paralisa operações essenciais com consequências severas."
];

export default function CriticalityMatrix({ 
  initialMatrix, 
  onSave,
  readonly = false
}: CriticalityMatrixProps) {
  // Estado para a matriz
  const [matrix, setMatrix] = useState<{ categories: Category[] }>({ 
    categories: initialMatrix?.categories || defaultCategories 
  });
  
  // Estados para edição
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<{categoryId: string, subcategoryId: string} | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState("");
  
  // Manipuladores para criticidade
  const handleCriticalityChange = (categoryId: string, subcategoryId: string, value: string) => {
    if (readonly) return;
    
    const newValue = parseInt(value);
    if (isNaN(newValue) || newValue < 0 || newValue > 5) return;
    
    const newMatrix = { ...matrix };
    const categoryIndex = newMatrix.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const subcategoryIndex = newMatrix.categories[categoryIndex].subcategories.findIndex(
      s => s.id === subcategoryId
    );
    if (subcategoryIndex === -1) return;
    
    newMatrix.categories[categoryIndex].subcategories[subcategoryIndex].business_criticality = newValue;
    setMatrix(newMatrix);
  };
  
  // Adicionar nova categoria
  const handleAddCategory = () => {
    if (readonly) return;
    
    // Criar ID único baseado no nome
    const id = `category-${Date.now()}`;
    const newCategory: Category = {
      id,
      name: `Nova Categoria ${matrix.categories.length + 1}`,
      icon: <Server className="h-5 w-5" />,
      subcategories: []
    };
    
    setMatrix(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    
    // Iniciar edição da nova categoria
    setEditingCategory(id);
    setNewCategoryName(newCategory.name);
  };
  
  // Remover categoria
  const handleRemoveCategory = (categoryId: string) => {
    if (readonly) return;
    
    setMatrix(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== categoryId)
    }));
  };
  
  // Adicionar nova subcategoria
  const handleAddSubcategory = (categoryId: string) => {
    if (readonly) return;
    
    const newMatrix = { ...matrix };
    const categoryIndex = newMatrix.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    const newSubcategory: Subcategory = {
      id: `subcategory-${Date.now()}`,
      name: `Nova Subcategoria ${newMatrix.categories[categoryIndex].subcategories.length + 1}`,
      business_criticality: 3,
      description: ""
    };
    
    newMatrix.categories[categoryIndex].subcategories.push(newSubcategory);
    setMatrix(newMatrix);
    
    // Iniciar edição da nova subcategoria
    setEditingSubcategory({ categoryId, subcategoryId: newSubcategory.id });
    setNewSubcategoryName(newSubcategory.name);
    setNewSubcategoryDescription("");
  };
  
  // Remover subcategoria
  const handleRemoveSubcategory = (categoryId: string, subcategoryId: string) => {
    if (readonly) return;
    
    const newMatrix = { ...matrix };
    const categoryIndex = newMatrix.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;
    
    newMatrix.categories[categoryIndex].subcategories = 
      newMatrix.categories[categoryIndex].subcategories.filter(s => s.id !== subcategoryId);
    
    setMatrix(newMatrix);
  };
  
  // Iniciar edição de categoria
  const startEditingCategory = (categoryId: string) => {
    if (readonly) return;
    
    const category = matrix.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    setEditingCategory(categoryId);
    setNewCategoryName(category.name);
  };
  
  // Salvar edição de categoria
  const saveEditingCategory = () => {
    if (!editingCategory || readonly) return;
    
    const newMatrix = { ...matrix };
    const categoryIndex = newMatrix.categories.findIndex(c => c.id === editingCategory);
    if (categoryIndex === -1) return;
    
    newMatrix.categories[categoryIndex].name = newCategoryName;
    setMatrix(newMatrix);
    setEditingCategory(null);
  };
  
  // Iniciar edição de subcategoria
  const startEditingSubcategory = (categoryId: string, subcategoryId: string) => {
    if (readonly) return;
    
    const category = matrix.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;
    
    setEditingSubcategory({ categoryId, subcategoryId });
    setNewSubcategoryName(subcategory.name);
    setNewSubcategoryDescription(subcategory.description || "");
  };
  
  // Salvar edição de subcategoria
  const saveEditingSubcategory = () => {
    if (!editingSubcategory || readonly) return;
    
    const newMatrix = { ...matrix };
    const categoryIndex = newMatrix.categories.findIndex(c => c.id === editingSubcategory.categoryId);
    if (categoryIndex === -1) return;
    
    const subcategoryIndex = newMatrix.categories[categoryIndex].subcategories.findIndex(
      s => s.id === editingSubcategory.subcategoryId
    );
    if (subcategoryIndex === -1) return;
    
    newMatrix.categories[categoryIndex].subcategories[subcategoryIndex].name = newSubcategoryName;
    newMatrix.categories[categoryIndex].subcategories[subcategoryIndex].description = newSubcategoryDescription;
    
    setMatrix(newMatrix);
    setEditingSubcategory(null);
  };
  
  // Salvar a matriz completa
  const handleSaveMatrix = () => {
    if (onSave) {
      onSave(matrix);
    }
  };
  
  // Cancela a edição
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Matriz de Criticidade de Negócio</span>
          {!readonly && (
            <Button onClick={handleSaveMatrix}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Matriz
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Defina a criticidade de negócio (0-5) para cada categoria e subcategoria de ativo.
          Esta criticidade será usada no cálculo do SLA para alertas.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Legenda de criticidade */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Legenda de Criticidade</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map(level => (
                <div key={level} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCriticalityColor(level)}`}>
                    {level}
                  </div>
                  <span className="text-xs mt-1">{level === 0 ? "Sem impacto" : level === 5 ? "Crítico" : `Nível ${level}`}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Matriz de categorias */}
          {matrix.categories.map((category) => (
            <Card key={category.id} className="border-gray-200">
              <CardHeader className="py-3 px-4 bg-gray-50 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  {category.icon || getIconForCategory(category.id)}
                  
                  {editingCategory === category.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-64"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={saveEditingCategory}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h3 className="font-medium">{category.name}</h3>
                  )}
                </div>
                
                {!readonly && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => startEditingCategory(category.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover categoria</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover a categoria "{category.name}"? 
                            Esta ação não pode ser desfeita e todos os dados associados serão perdidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRemoveCategory(category.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50">
                      <TableHead className="w-1/2">Subcategoria</TableHead>
                      <TableHead className="text-center">Criticidade de Negócio</TableHead>
                      <TableHead className="w-24 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {category.subcategories.map((subcategory) => (
                      <TableRow key={subcategory.id}>
                        <TableCell>
                          {editingSubcategory && 
                           editingSubcategory.categoryId === category.id && 
                           editingSubcategory.subcategoryId === subcategory.id ? (
                            <div>
                              <Input
                                value={newSubcategoryName}
                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                className="mb-2"
                              />
                              <Textarea
                                value={newSubcategoryDescription}
                                onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                                placeholder="Descrição (opcional)"
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium">{subcategory.name}</div>
                              {subcategory.description && (
                                <div className="text-sm text-gray-500">{subcategory.description}</div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Select
                                  disabled={readonly}
                                  value={subcategory.business_criticality.toString()}
                                  onValueChange={(value) => 
                                    handleCriticalityChange(category.id, subcategory.id, value)
                                  }
                                >
                                  <SelectTrigger 
                                    className={`w-16 h-10 text-lg font-medium ${getCriticalityColor(subcategory.business_criticality)}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[0, 1, 2, 3, 4, 5].map((value) => (
                                      <SelectItem 
                                        key={value} 
                                        value={value.toString()}
                                        className={`text-lg font-medium ${getCriticalityColor(value)}`}
                                      >
                                        {value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="w-64 p-3">
                                <div className="space-y-2">
                                  <p className="font-medium">Nível {subcategory.business_criticality}</p>
                                  <p className="text-sm">
                                    {criticalityDescriptions[subcategory.business_criticality]}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          {!readonly && (
                            <div className="flex justify-end space-x-1">
                              {editingSubcategory && 
                               editingSubcategory.categoryId === category.id && 
                               editingSubcategory.subcategoryId === subcategory.id ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={saveEditingSubcategory}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={cancelEditing}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => startEditingSubcategory(category.id, subcategory.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover subcategoria</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover a subcategoria "{subcategory.name}"?
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveSubcategory(category.id, subcategory.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {!readonly && (
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddSubcategory(category.id)}
                      className="text-blue-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Subcategoria
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {!readonly && (
            <Button 
              variant="outline" 
              className="w-full border-dashed border-gray-300 hover:border-gray-400"
              onClick={handleAddCategory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Nova Categoria
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}