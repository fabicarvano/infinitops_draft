import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';

interface SlaRiskIndicatorProps {
  deadline: string; // Prazo final do SLA (ISO string)
  totalDuration: number; // Duração total em minutos
  showTimer?: boolean; // Se deve mostrar o timer regressivo
}

export default function SlaRiskIndicator({ 
  deadline, 
  totalDuration, 
  showTimer = true 
}: SlaRiskIndicatorProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [riskLevel, setRiskLevel] = useState<'safe' | 'warning' | 'danger' | 'critical'>('safe');
  const [percentLeft, setPercentLeft] = useState(100);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const targetDate = new Date(deadline);
      const secondsRemaining = differenceInSeconds(targetDate, now);
      
      // Calculando o percentual restante
      const totalSeconds = totalDuration * 60;
      const elapsedSeconds = totalSeconds - secondsRemaining;
      const percentRemaining = Math.max(0, Math.min(100, 100 - (elapsedSeconds / totalSeconds * 100)));
      
      setPercentLeft(percentRemaining);
      
      // Determinando o nível de risco
      if (percentRemaining <= 5) {
        setRiskLevel('critical');
      } else if (percentRemaining <= 10) {
        setRiskLevel('danger');
      } else if (percentRemaining <= 25) {
        setRiskLevel('warning');
      } else {
        setRiskLevel('safe');
      }
      
      // Formatando o tempo restante
      if (secondsRemaining <= 0) {
        setTimeRemaining('Prazo Excedido');
        return;
      }
      
      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [deadline, totalDuration]);

  // Classes de estilo baseadas no nível de risco
  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          container: 'bg-red-50 border-red-200 animate-pulse',
          text: 'text-red-700',
          icon: 'text-red-600',
          badge: 'bg-red-500 text-white',
        };
      case 'danger':
        return {
          container: 'bg-orange-50 border-orange-200',
          text: 'text-orange-700',
          icon: 'text-orange-600',
          badge: 'bg-orange-500 text-white',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-700',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800',
        };
      default:
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-700',
          icon: 'text-green-600',
          badge: 'bg-green-100 text-green-800',
        };
    }
  };

  const styles = getRiskStyles();

  // Função para exibir o badge de risco
  const getRiskBadge = () => {
    if (riskLevel === 'critical') {
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}>URGENTE</span>;
    }
    if (riskLevel === 'danger') {
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}>EM RISCO</span>;
    }
    if (riskLevel === 'warning') {
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}>ATENÇÃO</span>;
    }
    return null;
  };

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-md border ${styles.container}`}>
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {riskLevel !== 'safe' ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <Clock className="h-5 w-5" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${styles.text}`}>
              {percentLeft <= 0 ? 'Prazo Excedido' : 'Prazo SLA:'}
            </span>
            {getRiskBadge()}
          </div>
          
          {showTimer && (
            <span className={`font-mono font-bold ${riskLevel === 'critical' ? 'animate-pulse' : ''} ${styles.text}`}>
              {timeRemaining}
            </span>
          )}
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
          <div 
            className={`h-1.5 rounded-full ${
              riskLevel === 'critical' ? 'bg-red-500' : 
              riskLevel === 'danger' ? 'bg-orange-500' : 
              riskLevel === 'warning' ? 'bg-yellow-500' : 
              'bg-green-500'
            } ${riskLevel === 'critical' ? 'animate-pulse' : ''}`}
            style={{ width: `${percentLeft}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}