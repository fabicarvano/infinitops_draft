import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type SupportAvailabilityType = "24x7" | "comercial" | "unificado" | "sem_equipe";

interface SupportTeam {
  name: string;
  level: "N1" | "N2" | "N3";
  description: string;
  contact_phone: string;
  contact_email: string;
  availability?: string;
}

interface SupportContactsPanelProps {
  assetId: number;
  assetType: string;
  serviceLevel: string; // "Platinum", "Premium", "Standard" ou "Personalizado"
  serviceHours: string; // "24x7", "Seg-Sex 06h-23h", etc.
}

export default function SupportContactsPanel({
  assetId,
  assetType,
  serviceLevel,
  serviceHours
}: SupportContactsPanelProps) {
  // Determinar o tipo de disponibilidade baseado no nível de serviço
  const availabilityType: SupportAvailabilityType = 
    serviceHours === "24x7" ? "24x7" :
    // Simular plantão unificado para alguns ativos (baseado no ID do ativo)
    assetId % 5 === 0 ? "unificado" :
    // Simular ausência de equipe para alguns ativos
    assetId % 11 === 0 ? "sem_equipe" :
    "comercial";
  
  // Verificar se o horário atual está dentro do horário comercial
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay(); // 0 = Domingo, 1-5 = Seg-Sex, 6 = Sábado
  const isBusinessHours = currentDay >= 1 && currentDay <= 5 && currentHour >= 8 && currentHour < 18;
  
  // Flags para determinar o que exibir
  const has24x7Support = availabilityType === "24x7";
  const hasNormalSupport = availabilityType === "comercial" && isBusinessHours;
  const hasSinglePerson = availabilityType === "unificado";
  const hasAnySupport = has24x7Support || hasNormalSupport || hasSinglePerson;
  
  // Simular equipes de suporte baseadas no tipo de ativo
  const teamN1: SupportTeam = {
    name: "Suporte Básico",
    level: "N1",
    description: "Equipe de primeiro atendimento",
    contact_phone: "(11) 3333-1111",
    contact_email: "suporte.n1@empresa.com.br",
    availability: isBusinessHours ? "Disponível agora" : "Fora do horário"
  };
  
  const teamN2: SupportTeam = {
    name: "Suporte Técnico",
    level: "N2",
    description: "Especialistas em infraestrutura",
    contact_phone: "(11) 3333-2222",
    contact_email: "suporte.n2@empresa.com.br",
    availability: isBusinessHours ? "Disponível agora" : "Fora do horário"
  };
  
  const teamN3: SupportTeam = {
    name: "Engenharia Avançada",
    level: "N3",
    description: "Especialistas de última instância",
    contact_phone: "(11) 3333-3333",
    contact_email: "suporte.n3@empresa.com.br",
    availability: serviceLevel === "Platinum" ? "Disponível 24x7" : 
                 (isBusinessHours ? "Disponível agora" : "Fora do horário")
  };
  
  // Dados de plantão unificado
  const singleDutyPerson = {
    name: "Carlos Plantão",
    phone: "(11) 99999-8888",
    email: "plantao@empresa.com.br"
  };
  
  // Contato de emergência para casos sem suporte
  const emergencyContact = {
    name: "Centro de Operações",
    phone: "(11) 5555-9999",
    email: "emergencia@empresa.com.br",
    instructions: "Em caso de emergência, ligue para o número acima e informe o código do ativo."
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Contatos de Suporte</h3>
          
          {/* Indicador de disponibilidade */}
          {has24x7Support && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Suporte 24x7
            </Badge>
          )}
          
          {availabilityType === "comercial" && isBusinessHours && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              Suporte em Horário Comercial
            </Badge>
          )}
          
          {availabilityType === "comercial" && !isBusinessHours && (
            <Badge className="bg-red-100 text-red-800 border-red-300">
              Fora do Horário de Atendimento
            </Badge>
          )}
          
          {hasSinglePerson && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              Plantão Unificado
            </Badge>
          )}
          
          {availabilityType === "sem_equipe" && (
            <Badge className="bg-red-100 text-red-800 border-red-300">
              Sem Equipe Disponível
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Caso 1: Suporte disponível (normal ou 24x7) */}
        {(hasNormalSupport || has24x7Support) && !hasSinglePerson && (
          <div className="space-y-4">
            {/* Exibir todos os níveis disponíveis */}
            <SupportLevelCard 
              level="N1"
              teamInfo={teamN1}
            />
            
            <SupportLevelCard 
              level="N2"
              teamInfo={teamN2}
            />
            
            <SupportLevelCard 
              level="N3"
              teamInfo={teamN3}
            />
          </div>
        )}
        
        {/* Caso 2: Plantão unificado */}
        {hasSinglePerson && (
          <div className="bg-amber-50 border border-amber-300 rounded-md p-4">
            <h4 className="font-medium">Plantão unificado para todos os níveis</h4>
            <div className="mt-2">
              <p><span className="font-medium">Responsável:</span> {singleDutyPerson.name}</p>
              <p><span className="font-medium">Contato:</span> {singleDutyPerson.phone}</p>
              <p><span className="font-medium">Email:</span> {singleDutyPerson.email}</p>
            </div>
            
            <div className="mt-3 p-2 bg-white rounded border border-amber-200">
              <p className="text-sm">
                Este profissional é responsável por todos os níveis de suporte para este tipo de ativo.
              </p>
            </div>
          </div>
        )}
        
        {/* Caso 3: Sem plantão */}
        {availabilityType === "sem_equipe" && (
          <div className="bg-red-50 border border-red-300 rounded-md p-4">
            <h4 className="font-medium">Sem equipe disponível</h4>
            <p className="mb-3">Não há equipe definida para este tipo de ativo/horário.</p>
            
            <div className="border-t border-red-200 pt-3 mt-3">
              <h5 className="font-medium">Contato de emergência:</h5>
              <p>{emergencyContact.name}</p>
              <p>{emergencyContact.phone}</p>
              
              <div className="mt-2 p-2 bg-white rounded border border-red-200">
                <p className="text-sm font-medium">Instruções:</p>
                <p className="text-sm">{emergencyContact.instructions}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Caso 4: Fora do horário comercial */}
        {availabilityType === "comercial" && !isBusinessHours && (
          <div className="mt-3 bg-blue-50 border border-blue-300 rounded-md p-3">
            <p className="text-sm">
              <span className="font-medium">Horário de atendimento regular:</span> Segunda a Sexta, 08:00 às 18:00
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Para emergências fora do horário:</span> Utilize os contatos acima.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 text-sm text-gray-500">
        <div className="w-full">
          <span>Tipo de ativo: <strong>{assetType}</strong> | Nível de serviço: <strong>{serviceLevel}</strong></span>
        </div>
      </CardFooter>
    </Card>
  );
}

// Componente para exibir um nível de suporte
function SupportLevelCard({ level, teamInfo }: { level: string, teamInfo: SupportTeam }) {
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">Nível {level} - {teamInfo.name}</h4>
          <p>{teamInfo.description}</p>
        </div>
      </div>
      
      <div className="mt-2">
        <p><span className="font-medium">Contato:</span> {teamInfo.contact_phone}</p>
        <p><span className="font-medium">Email:</span> {teamInfo.contact_email}</p>
        {teamInfo.availability && (
          <p className="text-sm mt-1">
            <span className="font-medium">Disponibilidade:</span>{" "}
            <span className={
              teamInfo.availability.includes("Disponível") 
                ? "text-green-600"
                : "text-red-600"
            }>
              {teamInfo.availability}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}