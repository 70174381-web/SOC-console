import { useState } from 'react';
import { Monitor, X, Cpu, HardDrive, Activity, AlertCircle } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useToast } from '../contexts/ToastContext';
import type { Endpoint, EndpointStatus } from '../types';

const STATUS_STYLES: Record<EndpointStatus, string> = {
  HEALTHY: 'bg-green-500/15 text-green-400 border border-green-500/30',
  ALERTING: 'bg-red-500/15 text-red-400 border border-red-500/30',
  INVESTIGATING: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  OFFLINE: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
  QUARANTINED: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
};

export default function Endpoints() {
  const { endpoints } = useAppState();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Endpoint | null>(null);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-white">Endpoint Fleet</h1>
          <p className="text-xs text-gray-500 mt-0.5">{endpoints.length} registered endpoints · {endpoints.filter(e => e.status !== 'OFFLINE').length} online</p>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2a45] bg-[#0a0e1a]/50">
                {['Host', 'OS', 'IP', 'Processes', 'Status', 'Last Seen', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a45]/40">
              {endpoints.map(ep => (
                <tr
                  key={ep.id}
                  onClick={() => setSelected(ep)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Monitor size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-200 font-medium">{ep.host}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{ep.os}</td>
                  <td className="px-4 py-3 text-xs text-[#00d4ff] font-mono">{ep.ip}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{ep.processes}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${STATUS_STYLES[ep.status]}`}>
                      {ep.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {ep.status === 'OFFLINE' ? (
                      <div className="group/tooltip relative inline-block">
                        <span className="text-xs text-gray-500 font-mono underline decoration-dotted cursor-help">{ep.lastSeen}</span>
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 hidden group-hover/tooltip:block z-10 shadow-xl">
                          <div className="font-mono text-orange-400 mb-1">Offline since: {ep.offlineSince}</div>
                          <div className="text-gray-400">{ep.offlineReason}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-mono">{ep.lastSeen}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(ep); }}
                        className="text-xs text-[#00d4ff] hover:text-white border border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 px-2.5 py-1 rounded font-mono transition-all"
                      >Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <EndpointPanel
          endpoint={selected}
          onClose={() => setSelected(null)}
          onAction={(action, ep) => {
            const messages: Record<string, string> = {
              isolate: `Isolation initiated for ${ep.host}`,
              scan: `Full scan queued on ${ep.host}`,
              restart: `Agent restart requested on ${ep.host}`,
            };
            showToast(messages[action], 'info');
          }}
        />
      )}
    </div>
  );
}

function EndpointPanel({ endpoint: ep, onClose, onAction }: {
  endpoint: Endpoint;
  onClose: () => void;
  onAction: (action: string, ep: Endpoint) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#0f1629] border-l border-[#1e2a45] h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0f1629] border-b border-[#1e2a45] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Monitor size={18} className="text-[#00d4ff]" />
            <div>
              <div className="text-sm font-semibold text-white">{ep.host}</div>
              <div className="text-xs text-gray-500 font-mono">{ep.ip}</div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${STATUS_STYLES[ep.status]}`}>{ep.status}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={16} className="text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['OS', ep.os], ['IP Address', ep.ip],
              ['Uptime', ep.uptime], ['Last Seen', ep.lastSeen],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#0a0e1a] rounded-lg px-3 py-2.5">
                <div className="text-[10px] font-mono text-gray-600">{k}</div>
                <div className="text-xs text-gray-200 mt-0.5">{v}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0e1a] rounded-lg px-3 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={12} className="text-[#00d4ff]" />
                <span className="text-[10px] font-mono text-gray-500">CPU USAGE</span>
              </div>
              <div className="text-xl font-bold text-white">{ep.cpu}%</div>
              <div className="w-full bg-[#1e2a45] rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${ep.cpu > 75 ? 'bg-red-400' : ep.cpu > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${ep.cpu}%` }}
                />
              </div>
            </div>
            <div className="bg-[#0a0e1a] rounded-lg px-3 py-3">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={12} className="text-[#00d4ff]" />
                <span className="text-[10px] font-mono text-gray-500">RAM USAGE</span>
              </div>
              <div className="text-xl font-bold text-white">{ep.ram}%</div>
              <div className="w-full bg-[#1e2a45] rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full ${ep.ram > 75 ? 'bg-red-400' : ep.ram > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${ep.ram}%` }}
                />
              </div>
            </div>
          </div>

          {ep.alerts.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Recent Alerts</h4>
              {ep.alerts.map(id => (
                <div key={id} className="flex items-center gap-2 bg-[#0a0e1a] rounded-lg px-3 py-2">
                  <AlertCircle size={13} className="text-red-400" />
                  <span className="text-xs text-gray-300 font-mono">{id}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Running Processes ({ep.processes})</h4>
            <div className="bg-[#0a0e1a] rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
              {ep.runningProcesses.map((p, i) => (
                <div key={i} className={`text-xs font-mono ${p.includes('SUSPICIOUS') ? 'text-red-400' : 'text-gray-400'}`}>{p}</div>
              ))}
              {ep.runningProcesses.length === 0 && (
                <div className="text-xs text-gray-600">No process data available</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Actions</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAction('isolate', ep)}
                className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-xs font-mono transition-all"
              >Isolate Host</button>
              <button
                onClick={() => onAction('scan', ep)}
                className="bg-[#00d4ff]/10 border border-[#00d4ff]/30 hover:bg-[#00d4ff]/20 text-[#00d4ff] py-2 rounded-lg text-xs font-mono transition-all"
              >Run Scan</button>
              <button
                onClick={() => onAction('restart', ep)}
                className="bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-400 py-2 rounded-lg text-xs font-mono transition-all"
              >Restart Agent</button>
            </div>
          </div>

          {ep.status === 'OFFLINE' && (
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg px-4 py-3">
              <div className="flex items-start gap-2">
                <Activity size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs font-mono text-gray-300">Offline since: {ep.offlineSince}</div>
                  <div className="text-xs text-gray-500 mt-1">{ep.offlineReason}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
