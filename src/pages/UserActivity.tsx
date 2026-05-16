import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { MOCK_USER_EVENTS } from '../data/mockData';
import type { UserEvent } from '../types';

const RISK_STYLES: Record<string, string> = {
  High: 'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-green-500/15 text-green-400 border border-green-500/30',
};

export default function UserActivity() {
  const [events] = useState<UserEvent[]>(MOCK_USER_EVENTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = events.filter(e => {
    if (riskFilter !== 'All' && e.riskScore !== riskFilter) return false;
    if (userFilter && !e.username.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (dateFilter && !e.timestamp.startsWith(dateFilter)) return false;
    return true;
  });

  const users = [...new Set(events.map(e => e.username))];

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">User Activity</h1>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} events · {events.filter(e => e.riskScore === 'High').length} high-risk</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-400">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-[10px] font-mono text-gray-600 mb-1">RISK LEVEL</label>
            <div className="flex gap-1">
              {(['All', 'High', 'Medium', 'Low'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`text-xs px-3 py-1.5 rounded font-mono transition-all border ${
                    riskFilter === r
                      ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30'
                      : 'text-gray-500 border-[#1e2a45] hover:border-gray-500'
                  }`}
                >{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-600 mb-1">USERNAME</label>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40"
            >
              <option value="">All users</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-600 mb-1">DATE</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2a45] bg-[#0a0e1a]/50">
              {['Timestamp', 'Username', 'Host', 'Action', 'IP', 'Risk', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2a45]/40">
            {filtered.map(event => (
              <React.Fragment key={event.id}>
                <tr
                  onClick={() => setExpanded(expanded === event.id ? null : event.id)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-[11px] font-mono text-gray-500">{event.timestamp}</td>
                  <td className="px-4 py-3 text-xs text-[#00d4ff] font-mono">{event.username}</td>
                  <td className="px-4 py-3 text-xs text-gray-300">{event.host}</td>
                  <td className="px-4 py-3 text-xs text-gray-300">{event.action}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-gray-500">{event.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${RISK_STYLES[event.riskScore]}`}>
                      {event.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {expanded === event.id
                      ? <ChevronUp size={14} className="text-gray-500" />
                      : <ChevronDown size={14} className="text-gray-500" />}
                  </td>
                </tr>
                {expanded === event.id && (
                  <tr className="bg-[#060912]">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                          event.riskScore === 'High' ? 'bg-red-400' :
                          event.riskScore === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <div>
                          <div className="text-xs font-mono text-gray-500 mb-1">{event.id} · {event.action}</div>
                          <p className="text-sm text-gray-300">{event.details}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-gray-600 text-sm">No events match the current filter</div>
        )}
      </div>
    </div>
  );
}
