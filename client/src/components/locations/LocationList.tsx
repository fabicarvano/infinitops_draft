import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LocationCard from './LocationCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Plus, Search } from 'lucide-react';
import { Location } from '@shared/schema';

interface LocationListProps {
  clientId?: number;
  onAddLocation?: () => void;
  onEditLocation?: (location: Location) => void;
  onDeleteLocation?: (location: Location) => void;
  onViewLocationDetails?: (location: Location) => void;
}

const LocationList: React.FC<LocationListProps> = ({
  clientId,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onViewLocationDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  // Obter locations pela API
  const { data: locations, isLoading, isError } = useQuery({
    queryKey: clientId 
      ? ['/api/locations', 'by-client', clientId]
      : ['/api/locations'],
    queryFn: async () => {
      const url = clientId 
        ? `/api/locations/client/${clientId}` 
        : '/api/locations';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha ao carregar localizações');
      }
      return response.json() as Promise<Location[]>;
    }
  });

  // Filtrar localizações com base no termo de busca e tipo
  const filteredLocations = locations?.filter(location => {
    const matchesSearch = 
      searchTerm === '' ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (location.description && 
       location.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (location.address && 
       location.address.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = 
      filterType === 'todos' || filterType === '' || 
      location.location_type.toLowerCase() === filterType.toLowerCase();
      
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando localizações...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar as localizações. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-bold">Localizações</h2>
        {onAddLocation && (
          <Button onClick={onAddLocation} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nova Localização
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar localizações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="matriz">Matriz</SelectItem>
              <SelectItem value="filial">Filial</SelectItem>
              <SelectItem value="datacenter">Data Center</SelectItem>
              <SelectItem value="escritório">Escritório</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLocations?.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Nenhuma localização encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations?.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={onEditLocation ? () => onEditLocation(location) : undefined}
              onDelete={onDeleteLocation ? () => onDeleteLocation(location) : undefined}
              onViewDetails={onViewLocationDetails ? () => onViewLocationDetails(location) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationList;