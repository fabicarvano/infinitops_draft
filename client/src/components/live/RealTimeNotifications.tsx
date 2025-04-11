import React, { useEffect, useState } from 'react';
import { useWebSocket, WebSocketMessage } from '@/hooks/use-websocket';
import { Bell, Server, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RealTimeNotifications() {
  const { isConnected, messages, acknowledgeAlert } = useWebSocket();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<WebSocketMessage[]>([]);

  // Filtrar mensagens para obter apenas alertas
  useEffect(() => {
    const newAlerts = messages.filter(
      (msg) => msg.type === 'new_alert' || msg.type === 'alert_updated'
    );
    setAlerts(newAlerts);
  }, [messages]);

  // Reconhecer alerta
  const handleAcknowledge = (alertId: number) => {
    acknowledgeAlert(alertId);
    toast({
      title: 'Alerta reconhecido',
      description: `Você reconheceu o alerta #${alertId}`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bell className="h-5 w-5 mr-2 text-amber-500" />
            Notificações em Tempo Real
          </CardTitle>
          <Badge
            variant={isConnected ? 'outline' : 'destructive'}
            className={`${isConnected ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}`}
          >
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="flex justify-center mb-2">
              <Bell className="h-10 w-10 text-slate-300" />
            </div>
            <p>Nenhuma notificação recebida</p>
            <p className="text-sm mt-1">As notificações aparecerão aqui em tempo real</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                if (alert.type === 'new_alert') {
                  const severity = alert.alert.severity;
                  return (
                    <Alert
                      key={`alert-${index}`}
                      variant={severity === 'critical' ? 'destructive' : severity === 'high' ? 'default' : 'outline'}
                      className="relative"
                    >
                      <div className="flex items-start gap-2">
                        {severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : (
                          <Server className="h-5 w-5" />
                        )}
                        <div className="flex-1">
                          <AlertTitle className="text-sm font-semibold flex items-center">
                            {severity === 'critical' ? 'ALERTA CRÍTICO' : 'Novo Alerta'}
                            <Clock className="h-3 w-3 ml-2 mr-1" />
                            <span className="text-xs font-normal">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </AlertTitle>
                          <AlertDescription className="text-xs mt-1">
                            {alert.alert.message}
                          </AlertDescription>
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {severity === 'critical' 
                                ? 'Crítico' 
                                : severity === 'high'
                                  ? 'Alto'
                                  : severity === 'medium'
                                    ? 'Médio'
                                    : 'Baixo'}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={() => handleAcknowledge(alert.alert.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reconhecer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  );
                } else if (alert.type === 'alert_updated') {
                  return (
                    <div key={`update-${index}`} className="flex items-center gap-2 text-sm text-slate-500 py-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Alerta #{alert.alertId} foi reconhecido</span>
                      <span className="text-xs ml-auto">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}