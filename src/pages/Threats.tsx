import { useState } from 'react';
import { Copy, Ban, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useToast } from '../contexts/ToastContext';

export default function Threats() {
  const { threats, blockThreatHash } = useAppState();
  const { showToast } = useToast();
  const [lastSync] = useState('2024-05-15 09:00:00 UTC');

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash).catch(() => {});
    showToast('Hash copied to clipboard', 'success');
  };

  const blocked = threats.filter(t => t.blocked);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Threat Intelligence</h1>
          <p className="text-xs text-gray-500 mt-0.5">MalwareBazaar feed · {threats.length} entries</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-mono">LIVE</span>
          <span className="text-xs text-gray-500 font-mono">Last sync: {lastSync}</span>
          <button className="flex items-center gap-1.5 text-xs text-gray-400 border border-[#1e2a45] hover:border-gray-500 px-3 py-1.5 rounded-lg font-mono transition-all">
            <RefreshCw size={11} /> Sync
          </button>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1e2a45]">
          <h2 className="text-sm font-semibold text-white">MalwareBazaar Intel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2a45] bg-[#0a0e1a]/50">
                {['SHA256', 'Malware Name', 'Tags', 'Date Added', 'Confidence', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-mono text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a45]/40">
              {threats.map(t => (
                <tr key={t.id} className={`hover:bg-white/[0.02] transition-colors ${t.blocked ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-gray-400">{t.sha256.slice(0, 16)}...{t.sha256.slice(-8)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-200 font-medium">{t.malwareName}</span>
                      {t.blocked && <span className="text-[9px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded">BLOCKED</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 bg-[#0a0e1a] text-gray-500 border border-[#1e2a45] rounded">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{t.dateAdded}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#0a0e1a] rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${t.confidence >= 90 ? 'bg-red-400' : t.confidence >= 75 ? 'bg-yellow-400' : 'bg-green-400'}`}
                          style={{ width: `${t.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-300">{t.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyHash(t.sha256)}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-gray-300 transition-colors"
                        title="Copy Hash"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => { if (!t.blocked) { blockThreatHash(t.id); showToast(`Hash ${t.sha256.slice(0,12)}... blocked`, 'warning'); } }}
                        disabled={t.blocked}
                        className={`p-1.5 rounded transition-colors ${t.blocked ? 'text-orange-400 cursor-not-allowed' : 'text-gray-500 hover:text-orange-400 hover:bg-orange-500/10'}`}
                        title={t.blocked ? 'Already blocked' : 'Block Hash'}
                      >
                        {t.blocked ? <CheckCircle size={12} /> : <Ban size={12} />}
                      </button>
                      <a
                        href={`https://bazaar.abuse.ch/sample/${t.sha256}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-[#00d4ff] transition-colors"
                        title="View on MalwareBazaar"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {blocked.length > 0 && (
        <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Blocked Hashes ({blocked.length})</h2>
          <div className="space-y-2">
            {blocked.map(t => (
              <div key={t.id} className="flex items-center gap-3 bg-orange-500/5 border border-orange-500/20 rounded-lg px-4 py-2.5">
                <Ban size={13} className="text-orange-400 shrink-0" />
                <span className="text-xs font-mono text-gray-300">{t.malwareName}</span>
                <span className="text-[10px] font-mono text-gray-600 ml-auto">{t.sha256.slice(0, 24)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
