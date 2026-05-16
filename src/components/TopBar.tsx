import { useState, useEffect } from 'react';
import { Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppState } from '../contexts/AppStateContext';

export default function TopBar() {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { alerts } = useAppState();
  const [time, setTime] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc5 = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      setTime(utc5.toISOString().slice(11, 19) + ' UTC+5');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const unresolved = alerts.filter(a => a.status !== 'Resolved');
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'Resolved').length;

  return (
    <header className="h-12 bg-[#0a0e1a] border-b border-[#1e2a45] flex items-center px-5 gap-4 shrink-0 relative z-50">
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-xs font-mono">LIVE</span>
        <span className="text-gray-500 text-xs font-mono ml-3">Shift: Alpha</span>
      </div>

      <div className="text-[#00d4ff] text-xs font-mono tabular-nums">{time}</div>

      <div className="relative">
        <button
          onClick={() => setShowNotifs(prev => !prev)}
          className="relative p-1.5 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Bell size={16} className="text-gray-400" />
          {unresolved.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {unresolved.length}
            </span>
          )}
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-full mt-1 w-80 bg-[#0f1629] border border-[#1e2a45] rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#1e2a45] flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Recent Alerts</span>
              {criticalCount > 0 && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-mono">
                  {criticalCount} CRITICAL
                </span>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {unresolved.slice(0, 6).map(a => (
                <div key={a.id} className="px-4 py-2.5 border-b border-[#1e2a45]/50 hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      a.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      a.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      a.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{a.severity}</span>
                    <span className="text-xs text-gray-300 truncate">{a.title}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{a.host} · {a.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={toggle} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
        {isDark ? <Sun size={15} className="text-gray-400" /> : <Moon size={15} className="text-gray-400" />}
      </button>

      <div className="flex items-center gap-2 pl-3 border-l border-[#1e2a45]">
        <div className="w-7 h-7 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 flex items-center justify-center">
          <span className="text-[#00d4ff] text-[11px] font-bold">JS</span>
        </div>
        <div className="hidden sm:block">
          <div className="text-gray-300 text-xs font-medium">SOC Analyst L3</div>
          <div className="text-gray-500 text-[10px] font-mono">j.smith</div>
        </div>
        <ChevronDown size={12} className="text-gray-500" />
        <button
          onClick={logout}
          className="ml-1 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group"
          title="Logout"
        >
          <LogOut size={14} className="text-gray-500 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </header>
  );
}
