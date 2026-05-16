import { useState } from 'react';
import { Search, RotateCcw, X, FolderOpen, AlertCircle } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useToast } from '../contexts/ToastContext';
import type { FIMEvent } from '../types';

const MONITORED_PATHS = [
  { path: '/etc/*', host: 'All Linux hosts', events: 34 },
  { path: '/root/.ssh/authorized_keys', host: 'DC-PROD-02, DEV-SRV-01', events: 8 },
  { path: '/etc/ssh/sshd_config', host: 'All Linux hosts', events: 5 },
  { path: 'C:\\Windows\\System32\\*', host: 'All Windows hosts', events: 22 },
  { path: 'C:\\Windows\\System32\\drivers\\etc\\hosts', host: 'All Windows hosts', events: 4 },
  { path: 'C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\*', host: 'All Windows hosts', events: 12 },
];

export default function FIM() {
  const { fimEvents, revertFimEvent } = useAppState();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [revertConfirm, setRevertConfirm] = useState<FIMEvent | null>(null);

  const filtered = fimEvents.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.host.toLowerCase().includes(q) || e.filePath.toLowerCase().includes(q) || e.user.toLowerCase().includes(q);
  });

  const handleRevert = (event: FIMEvent) => {
    revertFimEvent(event.id);
    setRevertConfirm(null);
    showToast(`Revert job queued for ${event.host}`, 'info');
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">File Integrity Monitor</h1>
          <p className="text-xs text-gray-500 mt-0.5">{fimEvents.filter(e => e.status === 'ACTIVE').length} active events · {fimEvents.filter(e => e.status === 'REVERTED').length} reverted</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by host, path, user..."
            className="bg-[#0f1629] border border-[#1e2a45] rounded-lg pl-8 pr-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]/40 w-60"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(event => (
          <FIMCard
            key={event.id}
            event={event}
            onRevert={() => setRevertConfirm(event)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-10 text-center text-gray-600 text-sm">
            No FIM events match the filter
          </div>
        )}
      </div>

      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen size={16} className="text-[#00d4ff]" />
          <h2 className="text-sm font-semibold text-white">Monitored Paths</h2>
        </div>
        <div className="space-y-2">
          {MONITORED_PATHS.map((p, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#0a0e1a] rounded-lg px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs font-mono text-[#00d4ff] flex-1">{p.path}</span>
              <span className="text-xs text-gray-500">{p.host}</span>
              <span className="text-[10px] font-mono bg-[#1e2a45] text-gray-500 px-2 py-0.5 rounded">{p.events} events</span>
            </div>
          ))}
        </div>
      </div>

      {revertConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setRevertConfirm(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-[#0f1629] border border-[#1e2a45] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Confirm Revert</h3>
              <button onClick={() => setRevertConfirm(null)} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="flex items-start gap-3 mb-5">
              <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300">Are you sure you want to revert this change?</p>
                <p className="text-xs font-mono text-gray-500 mt-2">{revertConfirm.filePath} on {revertConfirm.host}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRevertConfirm(null)} className="px-4 py-2 text-sm text-gray-400 border border-[#1e2a45] rounded-lg hover:bg-white/5">Cancel</button>
              <button onClick={() => handleRevert(revertConfirm)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20">
                <RotateCcw size={14} /> Confirm Revert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FIMCard({ event, onRevert }: { event: FIMEvent; onRevert: () => void }) {
  return (
    <div className={`bg-[#0f1629] border rounded-xl overflow-hidden ${event.status === 'REVERTED' ? 'border-[#1e2a45] opacity-60' : 'border-[#1e2a45]'}`}>
      <div className="px-5 py-3 border-b border-[#1e2a45] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            event.changeType === 'CREATE' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
            'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
          }`}>{event.changeType}</span>
          <span className="text-sm font-mono text-gray-300">{event.filePath}</span>
        </div>
        <div className="flex items-center gap-3">
          {event.status === 'REVERTED' ? (
            <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">REVERTED</span>
          ) : (
            <button
              onClick={onRevert}
              className="flex items-center gap-1.5 text-xs text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 px-3 py-1.5 rounded font-mono transition-all"
            >
              <RotateCcw size={11} /> Revert
            </button>
          )}
        </div>
      </div>
      <div className="px-5 py-3">
        <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 font-mono flex-wrap">
          <span>Host: <span className="text-[#00d4ff]">{event.host}</span></span>
          <span>User: <span className="text-gray-300">{event.user}</span></span>
          <span>{event.timestamp}</span>
        </div>
        <div className="bg-[#060912] rounded-lg p-3 font-mono text-[11px] space-y-0.5">
          {event.diffAdded.map((line, i) => (
            <div key={`add-${i}`} className="text-green-400 flex gap-2">
              <span className="text-green-600 select-none">+</span>
              <span>{line}</span>
            </div>
          ))}
          {event.diffRemoved.map((line, i) => (
            <div key={`rem-${i}`} className="text-red-400 flex gap-2">
              <span className="text-red-600 select-none">-</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
