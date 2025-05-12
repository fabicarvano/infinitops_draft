import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocationList, LocationModal, LocationDetails } from '@/components/locations';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Location } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const LocationsPage: React.FC = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  
  // Buscar todos os clientes para o seletor
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Falha ao carregar clientes');
      }
      return response.json();
    }
  });

  // Por padrão, usamos o ID do primeiro cliente ativo
  const defaultClientId = clients?.find(client => client.status === 'active')?.id || 1;
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  
  // Usar o ID do cliente selecionado ou o padrão
  const clientId = selectedClientId || defaultClientId;

  const handleAddLocation = () => {
    setSelectedLocation(undefined);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
    setIsViewingDetails(false);
  };

  const handleViewLocationDetails = (location: Location) => {
    setSelectedLocation(location);
    setIsViewingDetails(true);
  };

  const handleBackFromDetails = () => {
    setIsViewingDetails(false);
    setSelectedLocation(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Localizações</h1>
        <Button onClick={handleAddLocation}>
          <Plus className="mr-2 h-4 w-4" /> Nova Localização
        </Button>
      </div>

      {isViewingDetails && selectedLocation ? (
        <LocationDetails 
          location={selectedLocation} 
          onBack={handleBackFromDetails}
          onEdit={() => handleEditLocation(selectedLocation)}
        />
      ) : (
        <LocationList 
          clientId={clientId}
          onAddLocation={handleAddLocation}
          onEditLocation={handleEditLocation}
          onViewLocationDetails={handleViewLocationDetails}
        />
      )}

      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={clientId}
        location={selectedLocation}
        afterSave={() => {
          setIsModalOpen(false);
          toast({
            title: selectedLocation ? 'Localização atualizada' : 'Localização criada',
            description: selectedLocation 
              ? `A localização foi atualizada com sucesso.` 
              : 'Uma nova localização foi criada com sucesso.',
          });
        }}
      />
    </div>
  );
};

export default LocationsPage;