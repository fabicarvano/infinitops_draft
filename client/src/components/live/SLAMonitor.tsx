import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket } from '@/hooks/use-websocket';

interface SLAItem {
  id: number;
  ticketId: number;
  client: string;
  asset: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: Date;
  targetTime: Date;
  remainingTime: number; // em minutos
  percentage: number;
  isVip: boolean;
}

export function SLAMonitor() {
  const { messages, updateTicketStatus } = useWebSocket();
  const [slaItems, setSlaItems] = useState<SLAItem[]>([]);
  const [expanded, setExpanded] = useState(true);
  
  // Dados de exemplo para SLA
  useEffect(() => {
    // Simulação de dados para o SLA
    const mockSLAItems: SLAItem[] = [
      {
        id: 1,
        ticketId: 1001,
        client: 'Banco Digital S/A',
        asset: 'Servidor de Produção SQL',
        severity: 'critical',
        startTime: new Date(Date.now() - 50 * 60 * 1000), // 50 minutos atrás
        targetTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos restantes
        remainingTime: 10,
        percentage: 85,
        isVip: true
      },
      {
        id: 2,
        ticketId: 1002,
        client: 'Empresa de Telecom',
        asset: 'Roteador Principal',
        severity: 'high',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        targetTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutos restantes
        remainingTime: 90,
        percentage: 35,
        isVip: false
      },
      {
        id: 3,
        ticketId: 1003,
        client: 'Rede de Lojas',
        asset: 'Gateway de Pagamentos',
        severity: 'medium',
        startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        targetTime: new Date(Date.now() + 165 * 60 * 1000), // 165 minutos restantes
        remainingTime: 165,
        percentage: 15,
        isVip: false
      }
    ];

    setSlaItems(mockSLAItems);
    
    // Atualizar o tempo restante a cada minuto
    const interval = setInterval(() => {
      setSlaItems(prevItems => 
        prevItems.map(item => {
          const now = new Date();
          const targetTime = new Date(item.targetTime);
          const diffMs = targetTime.getTime() - now.getTime();
          const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
          
          // Calcular nova porcentagem
          const totalTimeMin = (targetTime.getTime() - new Date(item.startTime).getTime()) / 60000;
          const newPercentage = Math.min(100, Math.max(0, 100 - (diffMinutes / totalTimeMin * 100)));
          
          return {
            ...item,
            remainingTime: diffMinutes,
            percentage: newPercentage
          };
        })
      );
    }, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, []);
  
  // Responder a mensagens do WebSocket
  useEffect(() => {
    // Procurar por atualizações de chamados nas mensagens
    const ticketUpdates = messages.filter(msg => msg.type === 'ticket_updated');
    
    if (ticketUpdates.length > 0) {
      const latestUpdate = ticketUpdates[ticketUpdates.length - 1];
      
      if (latestUpdate.status === 'resolved' || latestUpdate.status === 'closed') {
        // Remover chamado da lista de SLA
        setSlaItems(prevItems => 
          prevItems.filter(item => item.ticketId !== latestUpdate.ticketId)
        );
      }
    }
  }, [messages]);
  
  // Resolver um chamado
  const handleResolveTicket = (ticketId: number) => {
    updateTicketStatus(ticketId, 'resolved');
  };
  
  // Obter cor baseada na severidade
  const getSeverityColor = (severity: string, isExpired: boolean = false) => {
    if (isExpired) return 'bg-red-500';
    
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Formatar tempo restante
  const formatRemainingTime = (minutes: number): string => {
    if (minutes <= 0) return 'Expirado';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setExpanded(!expanded)}
        >
          <CardTitle className="text-lg font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Monitoramento de SLA
          </CardTitle>
          <Button variant="ghost" size="sm">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          {slaItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-10 w-10 text-green-300" />
              </div>
              <p>Nenhum SLA ativo no momento</p>
              <p className="text-sm mt-1">Todos os chamados estão dentro do prazo</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[350px] pr-4">
              <div className="space-y-4">
                {slaItems
                  .sort((a, b) => {
                    // Primeiro ordenar por VIP
                    if (a.isVip && !b.isVip) return -1;
                    if (!a.isVip && b.isVip) return 1;
                    
                    // Depois por severidade
                    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                      return severityOrder[a.severity] - severityOrder[b.severity];
                    }
                    
                    // Por fim, por tempo restante
                    return a.remainingTime - b.remainingTime;
                  })
                  .map((item) => {
                    const isExpired = item.remainingTime <= 0;
                    const progressColor = isExpired 
                      ? 'bg-red-500' 
                      : item.percentage > 75 
                        ? 'bg-red-500' 
                        : item.percentage > 50 
                          ? 'bg-orange-400' 
                          : 'bg-blue-500';
                          
                    return (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Badge 
                              variant="outline"
                              className={`mr-2 ${
                                item.severity === 'critical' 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : item.severity === 'high' 
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {item.severity === 'critical' 
                                ? 'Crítico' 
                                : item.severity === 'high' 
                                  ? 'Alto' 
                                  : item.severity === 'medium' 
                                    ? 'Médio' 
                                    : 'Baixo'}
                            </Badge>
                            <h3 className="font-medium text-sm">{item.asset}</h3>
                          </div>
                          
                          {item.isVip && (
                            <Badge className="bg-purple-500 hover:bg-purple-600">VIP</Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-slate-500 mb-2">
                          Cliente: <span className="text-slate-700">{item.client}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs mb-2">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>
                            Aberto: {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>
                            Meta: {new Date(item.targetTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Progresso</span>
                          <span 
                            className={`font-medium ${isExpired || item.percentage > 75 ? 'text-red-600' : ''}`}
                          >
                            {formatRemainingTime(item.remainingTime)}
                          </span>
                        </div>
                        
                        <Progress 
                          value={item.percentage} 
                          className={`h-2 bg-slate-200 [&>div]:${progressColor}`}
                        />
                        
                        <div className="mt-3 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleResolveTicket(item.ticketId)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolver
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                {/* Resumo */}
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Resumo SLA</span>
                    <span className="text-slate-600">{slaItems.length} ativos</span>
                  </div>
                  <Separator className="bg-slate-200 my-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Críticos: <span className="font-medium text-red-600">
                      {slaItems.filter(i => i.severity === 'critical').length}
                    </span></div>
                    <div>VIP: <span className="font-medium text-purple-600">
                      {slaItems.filter(i => i.isVip).length}
                    </span></div>
                    <div>Em risco: <span className="font-medium text-orange-600">
                      {slaItems.filter(i => i.percentage > 50).length}
                    </span></div>
                    <div>Expirados: <span className="font-medium text-red-600">
                      {slaItems.filter(i => i.remainingTime <= 0).length}
                    </span></div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}