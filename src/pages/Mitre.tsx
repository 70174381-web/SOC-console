import { useState } from 'react';
import { X } from 'lucide-react';
import { MITRE_TACTICS, MOCK_MITRE_CELLS } from '../data/mockData';
import type { MitreCell } from '../types';

const CELL_STYLES: Record<string, string> = {
  detected: 'bg-red-500/25 border-red-500/40 text-red-300 hover:bg-red-500/35',
  rule: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/25',
  none: 'bg-[#0a0e1a]/60 border-[#1e2a45] text-gray-700 hover:bg-[#1e2a45]/50',
};

export default function Mitre() {
  const [selected, setSelected] = useState<MitreCell | null>(null);

  const detected = MOCK_MITRE_CELLS.filter(c => c.status === 'detected').length;
  const ruled = MOCK_MITRE_CELLS.filter(c => c.status === 'rule').length;
  const total = MOCK_MITRE_CELLS.length;
  const coverage = Math.round(((detected + ruled) / total) * 100 * 10) / 10;

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">MITRE ATT&CK Mapping</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enterprise Matrix · v14</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-[#00d4ff]">{coverage}%</div>
            <div className="text-[10px] font-mono text-gray-500">Coverage</div>
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/25 border border-red-500/40" />
              <span className="text-gray-400">Detected ({detected})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500/15 border border-yellow-500/30" />
              <span className="text-gray-400">Rule Exists ({ruled})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#0a0e1a] border border-[#1e2a45]" />
              <span className="text-gray-400">No Coverage ({total - detected - ruled})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2a45]">
                <th className="text-left text-[9px] font-mono text-gray-600 uppercase px-3 py-3 w-32">Technique</th>
                {MITRE_TACTICS.map(t => (
                  <th key={t} className="text-center text-[9px] font-mono text-gray-500 uppercase px-1.5 py-3 min-w-[80px]">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const byTactic = MITRE_TACTICS.map(tactic => ({
                  tactic,
                  cells: MOCK_MITRE_CELLS.filter(c => c.tacticId === tactic),
                }));
                const maxRows = Math.max(...byTactic.map(t => t.cells.length));
                return Array.from({ length: maxRows }, (_, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-[#1e2a45]/30">
                    <td className="px-3 py-1" />
                    {byTactic.map(({ tactic, cells }) => {
                      const cell = cells[rowIdx];
                      if (!cell) return <td key={tactic} className="px-1.5 py-1" />;
                      return (
                        <td key={tactic} className="px-1.5 py-1 text-center">
                          <button
                            onClick={() => setSelected(cell)}
                            className={`text-[9px] font-mono px-1.5 py-1 rounded border transition-all cursor-pointer w-full text-left leading-tight ${CELL_STYLES[cell.status]}`}
                            title={`${cell.techniqueId}: ${cell.techniqueName}`}
                          >
                            <div className="font-bold">{cell.techniqueId}</div>
                            <div className="truncate opacity-80">{cell.techniqueName}</div>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-[#0f1629] border border-[#1e2a45] rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${CELL_STYLES[selected.status]}`}>
                    {selected.status === 'detected' ? 'DETECTED' : selected.status === 'rule' ? 'RULE EXISTS' : 'NO COVERAGE'}
                  </span>
                  <span className="text-xs font-mono text-gray-500">{selected.techniqueId}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{selected.techniqueName}</h3>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{selected.tacticId}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-4">{selected.description}</p>

            {selected.alerts.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">Triggered By</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.alerts.map(id => (
                    <span key={id} className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">{id}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.detectionRule && (
              <div>
                <div className="text-[10px] font-mono text-gray-500 uppercase mb-1.5">Detection Rule</div>
                <div className="bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 font-mono text-xs text-green-400">{selected.detectionRule}</div>
              </div>
            )}
            {!selected.detectionRule && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2 text-xs text-yellow-500 font-mono">
                No detection rule configured for this technique
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
