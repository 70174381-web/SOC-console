import { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import type { Endpoint, EndpointStatus } from '../types';

const STATUS_STYLES: Record<EndpointStatus, { badge: string; border: string; glow: boolean }> = {
  HEALTHY: { badge: 'bg-green-500/15 text-green-400 border border-green-500/30', border: 'border-[#1e2a45]', glow: false },
  ALERTING: { badge: 'bg-red-500/15 text-red-400 border border-red-500/30', border: 'border-red-500/50', glow: true },
  INVESTIGATING: { badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30', border: 'border-yellow-500/40', glow: false },
  OFFLINE: { badge: 'bg-gray-500/15 text-gray-500 border border-gray-500/30', border: 'border-gray-700', glow: false },
  QUARANTINED: { badge: 'bg-orange-500/15 text-orange-400 border border-orange-500/30', border: 'border-orange-500/40', glow: false },
};

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay(v => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.max(5, Math.min(95, v + delta));
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full bg-[#0a0e1a] rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${display}%` }}
      />
    </div>
  );
}

function EndpointTile({ endpoint }: { endpoint: Endpoint }) {
  const style = STATUS_STYLES[endpoint.status];
  const lastAlert = endpoint.alerts.length > 0 ? endpoint.alerts[endpoint.alerts.length - 1] : null;

  return (
    <div className={`bg-[#0f1629] border-2 rounded-xl p-4 transition-all duration-500 ${style.border} ${style.glow ? 'shadow-[0_0_20px_rgba(255,68,68,0.2)]' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {style.glow && <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
          <span className="text-sm font-semibold text-white font-mono">{endpoint.host}</span>
        </div>
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${style.badge}`}>
          {endpoint.status}
        </span>
      </div>

      <div className="text-[11px] font-mono text-gray-500 mb-3">{endpoint.ip}</div>

      {endpoint.status !== 'OFFLINE' ? (
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-gray-600">CPU</span>
              <span className="text-[9px] font-mono text-gray-400">{endpoint.cpu}%</span>
            </div>
            <AnimatedBar
              value={endpoint.cpu}
              color={endpoint.cpu > 75 ? 'bg-red-400' : endpoint.cpu > 50 ? 'bg-yellow-400' : 'bg-green-400'}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-gray-600">RAM</span>
              <span className="text-[9px] font-mono text-gray-400">{endpoint.ram}%</span>
            </div>
            <AnimatedBar
              value={endpoint.ram}
              color={endpoint.ram > 75 ? 'bg-red-400' : endpoint.ram > 50 ? 'bg-yellow-400' : 'bg-blue-400'}
            />
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-gray-600 font-mono">Agent offline · No data</div>
      )}

      {lastAlert && (
        <div className="mt-3 pt-3 border-t border-[#1e2a45]">
          <div className="text-[9px] font-mono text-gray-600 mb-0.5">LAST ALERT</div>
          <div className="text-[10px] text-gray-400 truncate">{lastAlert}</div>
        </div>
      )}
    </div>
  );
}

export default function WatchFloor() {
  const { endpoints } = useAppState();
  const alerting = endpoints.filter(e => e.status === 'ALERTING').length;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-white">Watch Floor</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time endpoint overview · {endpoints.length} hosts</p>
        </div>
        {alerting > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-mono font-bold">{alerting} HOST{alerting > 1 ? 'S' : ''} ALERTING</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {endpoints.map(ep => (
          <EndpointTile key={ep.id} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}
