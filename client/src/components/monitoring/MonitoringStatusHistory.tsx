import { format, subHours, subMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type StatusType = "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";

interface StatusEntry {
  status: StatusType;
  timestamp: string;
  user?: string;
  comment?: string;
}

interface MonitoringStatusHistoryProps {
  alertId: number;
}

// Colors for different status types
const STATUS_COLORS: Record<StatusType, string> = {
  ativo: "bg-red-100 text-red-800 border-red-300",
  normalizado: "bg-green-100 text-green-800 border-green-300",
  flapping: "bg-amber-100 text-amber-800 border-amber-300",
  reconhecido: "bg-blue-100 text-blue-800 border-blue-300",
  suprimido: "bg-gray-100 text-gray-800 border-gray-300"
};

export default function MonitoringStatusHistory({ alertId }: MonitoringStatusHistoryProps) {
  // Mock history data - in production this would come from an API/database
  const now = new Date();
  
  // Generate sample history based on alert ID
  const generateSampleHistory = (id: number): StatusEntry[] => {
    // Seed history based on ID
    const seed = id % 5;
    const history: StatusEntry[] = [];
    
    // Start with detection
    history.push({
      status: "ativo",
      timestamp: subHours(now, 12 + seed).toISOString(),
    });
    
    if (seed === 0) {
      // Simple: detected -> normalized
      history.push({
        status: "normalizado",
        timestamp: subHours(now, 11 + seed).toISOString(),
      });
    } else if (seed === 1) {
      // Flapping: detected -> flapping -> normalized -> active again
      history.push({
        status: "flapping",
        timestamp: subHours(now, 11).toISOString(),
      });
      history.push({
        status: "normalizado",
        timestamp: subHours(now, 9).toISOString(),
      });
      history.push({
        status: "ativo",
        timestamp: subHours(now, 6).toISOString(),
      });
    } else if (seed === 2) {
      // Acknowledged: detected -> acknowledged
      history.push({
        status: "reconhecido",
        timestamp: subHours(now, 11).toISOString(),
        user: "Operador NOC",
        comment: "Problema sendo investigado pela equipe de infraestrutura"
      });
    } else if (seed === 3) {
      // Suppressed: detected -> suppressed by admin
      history.push({
        status: "suprimido",
        timestamp: subHours(now, 11).toISOString(),
        user: "Admin",
        comment: "Manutenção programada em andamento"
      });
    } else {
      // Complex: detected -> flapping -> acknowledged -> normalized
      history.push({
        status: "flapping",
        timestamp: subHours(now, 10).toISOString(),
      });
      history.push({
        status: "reconhecido",
        timestamp: subHours(now, 8).toISOString(),
        user: "Operador NOC",
        comment: "Instabilidade na rede está sendo tratada"
      });
      history.push({
        status: "normalizado",
        timestamp: subHours(now, 4).toISOString(),
      });
    }
    
    return history;
  };
  
  const statusHistory = generateSampleHistory(alertId);
  
  // Sort history by timestamp (newest first)
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <div className="space-y-4">
      {sortedHistory.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          Não há histórico de status disponível
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute h-full w-0.5 bg-gray-200 left-6 top-0"></div>
          
          {/* Timeline items */}
          <div className="space-y-6">
            {sortedHistory.map((entry, index) => (
              <div key={index} className="relative pl-14">
                {/* Status icon */}
                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${STATUS_COLORS[entry.status].split(' ')[0]} ${STATUS_COLORS[entry.status].split(' ')[1]}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-lg border p-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className={STATUS_COLORS[entry.status]}>
                        {entry.status}
                      </Badge>
                      {entry.user && (
                        <span className="ml-2 text-sm text-gray-500">
                          por <span className="font-medium">{entry.user}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {entry.comment && (
                    <p className="mt-2 text-sm text-gray-600">
                      {entry.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}