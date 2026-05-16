import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Monitor, Shield, Target, Zap,
  FileSearch, Users, Eye, ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Live Console' },
  { to: '/endpoints', icon: Monitor, label: 'Endpoint Fleet' },
  { to: '/threats', icon: Shield, label: 'Threat Intel' },
  { to: '/mitre', icon: Target, label: 'MITRE ATT&CK' },
  { to: '/automation', icon: Zap, label: 'Automation' },
  { to: '/fim', icon: FileSearch, label: 'File Integrity' },
  { to: '/user-activity', icon: Users, label: 'User Activity' },
  { to: '/watch-floor', icon: Eye, label: 'Watch Floor' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#0a0e1a] border-r border-[#1e2a45] flex flex-col h-full shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1e2a45]">
        <ShieldAlert className="text-[#00d4ff]" size={22} />
        <div>
          <div className="text-[#00d4ff] font-bold text-sm font-mono tracking-wide">INTERNEE.PK</div>
          <div className="text-gray-500 text-[10px] font-mono">EDR SOC CONSOLE</div>
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 group relative ${
                isActive
                  ? 'text-[#00d4ff] bg-[#00d4ff]/10 border-r-2 border-[#00d4ff]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`
            }
          >
            <Icon size={15} className="shrink-0" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-[#1e2a45]">
        <div className="text-[10px] font-mono text-gray-600">v2.4.1-stable</div>
        <div className="text-[10px] font-mono text-gray-600">
          {new Date().toLocaleDateString('en-CA')}
        </div>
      </div>
    </aside>
  );
}
