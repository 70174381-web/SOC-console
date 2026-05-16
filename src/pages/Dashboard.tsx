import { useState, useEffect, useRef } from 'react';
import { X, Shield, Activity, FileSearch, Clock, Search, ChevronRight, Download, Pause, Play } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppState } from '../contexts/AppStateContext';
import { useToast } from '../contexts/ToastContext';
import type { Alert, Severity } from '../types';
import { MTTR_SPARKLINE } from '../data/mockData';

const SEV_COLORS: Record<Severity, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border border-green-500/30',
};

const SEV_DOT: Record<Severity, string> = {
  CRITICAL: 'bg-red-400', HIGH: 'bg-orange-400', MEDIUM: 'bg-yellow-400', LOW: 'bg-green-400',
};

const SYSMON_TEMPLATES = [
  (t: string) => `[${t}] [Sysmon/1] Process Create: cmd.exe (PID 4821) parent: explorer.exe`,
  (t: string) => `[${t}] [Sysmon/3] Network Connect: 10.0.1.45:52341 → 185.220.101.47:443 (BLOCKED)`,
  (t: string) => `[${t}] [Sysmon/11] File Create: C:\\Users\\j.martinez\\AppData\\Local\\Temp\\upd.exe`,
  (t: string) => `[${t}] [Sysmon/13] Registry Value Set: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`,
  (t: string) => `[${t}] [Sysmon/10] Process Access: lsass.exe by cmd.exe [0x1410 PROCESS_VM_READ]`,
  (t: string) => `[${t}] [Sysmon/7] Image Load: C:\\Windows\\System32\\mshta.exe loaded wininet.dll`,
  (t: string) => `[${t}] [Sysmon/22] DNS Query: malware-c2.xyz → NXDOMAIN (blocked)`,
  (t: string) => `[${t}] [Sysmon/5] Process Terminate: update.exe (PID 3311) runtime: 12.4s`,
  (t: string) => `[${t}] [Sysmon/8] CreateRemoteThread: src=4821 target=lsass.exe`,
  (t: string) => `[${t}] [Sysmon/15] File Create Stream: alternate data stream :Zone.Identifier`,
];

function genTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
}

export default function Dashboard() {
  const { alerts, endpoints, updateAlertStatus, quarantineHost } = useAppState();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'All' | Severity>('All');
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [assignee, setAssignee] = useState('');
  const [logs, setLogs] = useState<string[]>(() =>
    Array.from({ length: 8 }, (_, i) => SYSMON_TEMPLATES[i % SYSMON_TEMPLATES.length](genTime()))
  );
  const [paused, setPaused] = useState(false);
  const [scrollLock, setScrollLock] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        const t = genTime();
        const template = SYSMON_TEMPLATES[Math.floor(Math.random() * SYSMON_TEMPLATES.length)];
        setLogs(prev => [...prev.slice(-99), template(t)]);
      }, 2000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  useEffect(() => {
    if (scrollLock && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, scrollLock]);

  const activeEndpoints = endpoints.filter(e => e.status !== 'OFFLINE').length;
  const unresolvedAlerts = alerts.filter(a => a.status !== 'Resolved');
  const highCount = unresolvedAlerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;
  const fimHits = 85;

  const sparkData = MTTR_SPARKLINE.map((v, i) => ({ day: i, v }));

  const filtered = alerts.filter(a => {
    if (filter !== 'All' && a.severity !== filter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      a.host.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q) ||
      a.ip.includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.tags.some(t => t.includes(q))
    );
  });

  const handleQuarantine = (alert: Alert) => {
    quarantineHost(alert.host);
    showToast(`Host ${alert.host} quarantined successfully`, 'warning');
    if (selectedAlert?.id === alert.id) {
      setSelectedAlert({ ...alert });
    }
  };

  const handleInvestigate = (alert: Alert) => {
    updateAlertStatus(alert.id, 'Investigating');
    showToast(`Alert ${alert.id} moved to Investigating`, 'info');
    if (selectedAlert?.id === alert.id) {
      setSelectedAlert({ ...alert, status: 'Investigating' });
    }
  };

  const exportLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysmon_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Log exported successfully', 'success');
  };

  return (
    <div className="p-5 space-y-5 text-gray-200">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="text-[#00d4ff]" size={18} />}
          label="Active Endpoints"
          value={`${activeEndpoints}/8`}
          sub="Online now"
          color="cyan"
        />
        <StatCard
          icon={<Shield className="text-red-400" size={18} />}
          label="Unresolved Alerts"
          value={unresolvedAlerts.length.toString()}
          sub={<span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-mono border border-red-500/30">{highCount} HIGH+</span>}
          color="red"
        />
        <StatCard
          icon={<FileSearch className="text-yellow-400" size={18} />}
          label="FIM Hits"
          value={fimHits.toString()}
          sub="Today"
          color="yellow"
        />
        <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-green-400" size={18} />
            <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">Mean Time to Resolve</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">14.2m</div>
              <div className="text-xs text-gray-500 mt-0.5">7-day avg</div>
            </div>
            <div className="w-28 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="v" stroke="#44ff88" strokeWidth={2} dot={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f1629', border: '1px solid #1e2a45', borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${v}m`, 'MTTR']}
                    labelFormatter={() => ''}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Triage */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1e2a45] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">Alert Triage</h2>
            <span className="text-xs text-gray-500 font-mono">{filtered.length} results</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-full font-mono transition-all ${
                  filter === f
                    ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-[#1e2a45]'
                }`}
              >{f}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search host, user, IP..."
              className="bg-[#0a0e1a] border border-[#1e2a45] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]/40 w-52"
            />
          </div>
        </div>

        <div className="divide-y divide-[#1e2a45]/50">
          {filtered.map(alert => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onClick={() => setSelectedAlert(alert)}
              isSelected={selectedAlert?.id === alert.id}
            />
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-gray-600 text-sm">No alerts match the current filter</div>
          )}
        </div>
      </div>

      {/* Sysmon Log */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1e2a45] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Live Sysmon Log</h2>
            <span className="text-[10px] font-mono text-gray-500">Endpoint: FIN-DEPT-MGR</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScrollLock(p => !p)}
              className={`text-xs px-3 py-1 rounded font-mono border transition-all ${
                scrollLock ? 'border-[#00d4ff]/40 text-[#00d4ff] bg-[#00d4ff]/10' : 'border-[#1e2a45] text-gray-500 hover:border-gray-500'
              }`}
            >Scroll-Lock: {scrollLock ? 'ON' : 'OFF'}</button>
            <button
              onClick={() => setPaused(p => !p)}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded font-mono border border-[#1e2a45] text-gray-400 hover:border-gray-500 transition-all"
            >
              {paused ? <Play size={11} /> : <Pause size={11} />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={exportLogs}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded font-mono border border-[#1e2a45] text-gray-400 hover:border-gray-500 transition-all"
            >
              <Download size={11} /> Export
            </button>
          </div>
        </div>
        <div
          ref={logRef}
          className="h-48 overflow-y-auto p-4 font-mono text-[11px] leading-5 bg-[#060912] space-y-0.5"
        >
          {logs.map((line, i) => (
            <div key={i} className={`${
              line.includes('BLOCKED') ? 'text-red-400' :
              line.includes('lsass') || line.includes('PROCESS_VM_READ') ? 'text-orange-400' :
              line.includes('Registry') || line.includes('CreateRemoteThread') ? 'text-yellow-400' :
              'text-gray-400'
            }`}>{line}</div>
          ))}
        </div>
      </div>

      {/* Alert Drawer */}
      {selectedAlert && (
        <AlertDrawer
          alert={selectedAlert}
          assignee={assignee}
          setAssignee={setAssignee}
          onClose={() => setSelectedAlert(null)}
          onQuarantine={() => handleQuarantine(selectedAlert)}
          onInvestigate={() => handleInvestigate(selectedAlert)}
          onStatusChange={(s) => {
            updateAlertStatus(selectedAlert.id, s);
            setSelectedAlert({ ...selectedAlert, status: s });
            showToast(`Alert status updated to ${s}`, 'success');
          }}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string;
  sub: React.ReactNode; color: string;
}) {
  const border = color === 'cyan' ? 'border-[#00d4ff]/20' : color === 'red' ? 'border-red-500/20' : color === 'yellow' ? 'border-yellow-500/20' : 'border-[#1e2a45]';
  return (
    <div className={`bg-[#0f1629] border ${border} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">{icon}
        <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

function AlertRow({ alert, onClick, isSelected }: { alert: Alert; onClick: () => void; isSelected: boolean }) {
  return (
    <div
      onClick={onClick}
      className={`px-5 py-3.5 cursor-pointer flex items-center gap-4 hover:bg-white/[0.03] transition-colors group ${isSelected ? 'bg-[#00d4ff]/5 border-l-2 border-[#00d4ff]' : 'border-l-2 border-transparent'}`}
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${SEV_DOT[alert.severity]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${SEV_COLORS[alert.severity]}`}>{alert.severity}</span>
          <span className="text-xs text-gray-400 font-mono bg-[#0a0e1a] px-1.5 py-0.5 rounded">{alert.mitreId}</span>
          <span className="text-sm text-gray-200 font-medium">{alert.title}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-[11px] text-gray-500 font-mono">{alert.timestamp}</span>
          <span className="text-[11px] text-gray-500">Host: <span className="text-[#00d4ff]">{alert.host}</span></span>
          <span className="text-[11px] text-gray-500">User: <span className="text-gray-300">{alert.user}</span></span>
          <span className="text-[11px] text-gray-500">{alert.ip}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
            alert.status === 'Open' ? 'bg-red-500/10 text-red-400' :
            alert.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-green-500/10 text-green-400'
          }`}>{alert.status}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {alert.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 bg-[#0a0e1a] text-gray-600 rounded border border-[#1e2a45]">{tag}</span>
          ))}
        </div>
      </div>
      <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
    </div>
  );
}

function AlertDrawer({ alert, onClose, onQuarantine, onInvestigate, onStatusChange, assignee, setAssignee }: {
  alert: Alert;
  onClose: () => void;
  onQuarantine: () => void;
  onInvestigate: () => void;
  onStatusChange: (s: Alert['status']) => void;
  assignee: string;
  setAssignee: (v: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-[#0f1629] border-l border-[#1e2a45] h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0f1629] border-b border-[#1e2a45] px-6 py-4 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${SEV_COLORS[alert.severity]}`}>{alert.severity}</span>
              <span className="text-xs font-mono text-gray-500">{alert.id}</span>
              <span className="text-xs font-mono text-gray-500 bg-[#0a0e1a] px-1.5 py-0.5 rounded">{alert.mitreId}</span>
            </div>
            <h3 className="text-sm font-semibold text-white leading-tight">{alert.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-4">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Description</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{alert.description}</p>
          </div>

          {/* Host Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Host Information</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Host', alert.host], ['User', alert.user], ['IP', alert.ip],
                ['MITRE Tactic', alert.mitreTactic], ['Timestamp', alert.timestamp],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#0a0e1a] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-gray-600 font-mono">{k}</div>
                  <div className="text-xs text-gray-200 font-mono mt-0.5">{v}</div>
                </div>
              ))}
              <div className="col-span-2 bg-[#0a0e1a] rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-600 font-mono">SHA256</div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5 break-all">{alert.sha256}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Event Timeline</h4>
            <div className="space-y-2">
              {alert.timeline.map((e, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#00d4ff] mt-1 shrink-0" />
                    {i < alert.timeline.length - 1 && <div className="w-px flex-1 bg-[#1e2a45] mt-1" />}
                  </div>
                  <div className="pb-2">
                    <span className="text-[10px] font-mono text-[#00d4ff]">{e.time}</span>
                    <p className="text-xs text-gray-300 mt-0.5">{e.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Recommended Actions</h4>
            <ul className="space-y-1.5">
              {alert.recommendedActions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[#00d4ff] font-mono shrink-0">{i + 1}.</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1.5">ASSIGN TO</label>
                <select
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40"
                >
                  <option value="">Unassigned</option>
                  <option>j.smith (L3)</option>
                  <option>m.chen (L2)</option>
                  <option>k.ali (L2)</option>
                  <option>s.hassan (L1)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1.5">STATUS</label>
                <select
                  value={alert.status}
                  onChange={e => onStatusChange(e.target.value as Alert['status'])}
                  className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40"
                >
                  <option>Open</option>
                  <option>Investigating</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onQuarantine}
                className="bg-orange-500/10 border border-orange-500/40 hover:bg-orange-500/20 text-orange-400 py-2 rounded-lg text-xs font-mono font-bold transition-all"
              >QUARANTINE HOST</button>
              <button
                onClick={onInvestigate}
                className="bg-[#00d4ff]/10 border border-[#00d4ff]/40 hover:bg-[#00d4ff]/20 text-[#00d4ff] py-2 rounded-lg text-xs font-mono font-bold transition-all"
              >INVESTIGATE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
