import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, FlaskConical, AlertCircle } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useToast } from '../contexts/ToastContext';
import type { AutomationRule, AlertRule } from '../types';

const ACTION_COLORS: Record<string, string> = {
  ISOLATE_HOST: 'bg-red-500/15 text-red-400 border border-red-500/30',
  KILL_TREE: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  DENY_EXEC: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  PAGE_ON_CALL: 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30',
};

const CHANNELS = ['email', 'slack', 'sms', 'webhook'] as const;

export default function Automation() {
  const {
    automationRules, toggleRule, updateRule, deleteRule, addRule,
    alertRules, toggleAlertRuleChannel,
    notifChannels, updateNotifChannel,
    dispatchLog, addDispatchLog,
  } = useAppState();
  const { showToast } = useToast();

  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: 'ISOLATE_HOST', enabled: true, severity: 'HIGH' });
  const [editForm, setEditForm] = useState({ name: '', condition: '' });

  const handleEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setEditForm({ name: rule.name, condition: rule.condition });
  };

  const handleSaveEdit = () => {
    if (!editingRule) return;
    updateRule(editingRule.id, editForm.name, editForm.condition);
    setEditingRule(null);
    showToast('Rule updated successfully', 'success');
  };

  const handleDelete = (id: string) => {
    deleteRule(id);
    setDeleteConfirm(null);
    showToast('Automation rule deleted', 'warning');
  };

  const handleAddRule = () => {
    if (!newRule.name.trim()) { showToast('Rule name is required', 'error'); return; }
    addRule({ name: newRule.name, condition: newRule.condition, action: newRule.action, enabled: newRule.enabled });
    setShowNewModal(false);
    setNewRule({ name: '', condition: '', action: 'ISOLATE_HOST', enabled: true, severity: 'HIGH' });
    showToast('New automation rule created', 'success');
  };

  const handleTestChannel = (ruleName: string, channel: string, target: string) => {
    showToast(`Test alert sent to ${channel}`, 'info');
    addDispatchLog({
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      rule: ruleName,
      channel,
      target,
    });
  };

  return (
    <div className="p-5 space-y-6">
      {/* Automation Rules */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Automation Rules</h1>
          <p className="text-xs text-gray-500 mt-0.5">{automationRules.filter(r => r.enabled).length} active rules</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#00d4ff]/10 border border-[#00d4ff]/40 hover:bg-[#00d4ff]/20 text-[#00d4ff] px-4 py-2 rounded-lg text-xs font-mono transition-all"
        >
          <Plus size={14} /> New Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {automationRules.map(rule => (
          <div key={rule.id} className={`bg-[#0f1629] border rounded-xl p-4 ${rule.enabled ? 'border-[#1e2a45]' : 'border-[#1e2a45] opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${ACTION_COLORS[rule.action]}`}>{rule.action}</span>
                  <span className="text-[10px] font-mono text-gray-600">fired {rule.fired}×</span>
                </div>
                <h3 className="text-sm font-medium text-white">{rule.name}</h3>
                <p className="text-[10px] font-mono text-gray-600 mt-1 break-all">{rule.condition}</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={rule.enabled} onChange={() => { toggleRule(rule.id); showToast(`Rule ${rule.enabled ? 'disabled' : 'enabled'}`, 'info'); }} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#1e2a45] peer-checked:bg-[#00d4ff]/50 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-[#00d4ff] after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => handleEdit(rule)} className="flex items-center gap-1.5 text-xs text-gray-400 border border-[#1e2a45] hover:border-gray-500 px-3 py-1.5 rounded font-mono transition-all">
                <Pencil size={11} /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(rule.id)} className="flex items-center gap-1.5 text-xs text-red-500 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 px-3 py-1.5 rounded font-mono transition-all">
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Rules & Channels */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1e2a45]">
          <h2 className="text-sm font-semibold text-white">Alert Rules & Notification Routing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2a45] bg-[#0a0e1a]/50">
                <th className="text-left text-[10px] font-mono text-gray-500 uppercase px-4 py-3">Rule</th>
                {CHANNELS.map(ch => (
                  <th key={ch} className="text-center text-[10px] font-mono text-gray-500 uppercase px-4 py-3">{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a45]/40">
              {alertRules.map(rule => (
                <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-gray-500 mb-0.5">{rule.id}</div>
                    <div className="text-sm text-gray-200">{rule.name}</div>
                  </td>
                  {CHANNELS.map(ch => (
                    <td key={ch} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={rule.channels[ch]} onChange={() => toggleAlertRuleChannel(rule.id, ch)} className="sr-only peer" />
                          <div className="w-8 h-4 bg-[#1e2a45] peer-checked:bg-[#00d4ff]/50 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0 after:left-0 after:bg-gray-500 peer-checked:after:bg-[#00d4ff] after:rounded-full after:h-4 after:w-4 after:transition-all" />
                        </label>
                        <button
                          onClick={() => handleTestChannel(rule.name, ch, ch === 'email' ? notifChannels.email : ch === 'slack' ? notifChannels.slack : ch === 'sms' ? notifChannels.sms || 'on-call' : notifChannels.webhook)}
                          className="text-[9px] font-mono text-gray-600 hover:text-[#00d4ff] border border-[#1e2a45] hover:border-[#00d4ff]/30 px-1.5 py-0.5 rounded transition-all"
                        >TEST</button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Notification Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            { key: 'email', label: 'Email', placeholder: 'team@example.com' },
            { key: 'slack', label: 'Slack Channel', placeholder: '#channel' },
            { key: 'sms', label: 'SMS / On-Call', placeholder: '+XX-XXX-XXXXXXX' },
            { key: 'webhook', label: 'Webhook URL', placeholder: 'https://...' },
          ] as const).map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{label}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notifChannels[key]}
                  onChange={e => updateNotifChannel(key, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 font-mono placeholder-gray-700 focus:outline-none focus:border-[#00d4ff]/40"
                />
                <button
                  onClick={() => handleTestChannel('Manual Test', label, notifChannels[key] || placeholder)}
                  className="flex items-center gap-1 text-xs px-3 py-2 border border-[#1e2a45] text-gray-500 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 rounded-lg font-mono transition-all"
                >
                  <FlaskConical size={11} /> TEST
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Log */}
      <div className="bg-[#0f1629] border border-[#1e2a45] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1e2a45]">
          <h2 className="text-sm font-semibold text-white">Dispatch Log</h2>
          <p className="text-xs text-gray-500 mt-0.5">Last {Math.min(dispatchLog.length, 10)} dispatches</p>
        </div>
        <div className="divide-y divide-[#1e2a45]/40">
          {dispatchLog.slice(0, 10).map(entry => (
            <div key={entry.id} className="px-5 py-2.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <span className="text-[10px] font-mono text-gray-600 shrink-0 w-36">{entry.timestamp}</span>
              <span className="text-xs text-gray-300 flex-1 truncate">{entry.rule}</span>
              <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-2 py-0.5 rounded">{entry.channel}</span>
              <span className="text-[10px] font-mono text-gray-500">{entry.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRule && (
        <Modal title="Edit Rule" onClose={() => setEditingRule(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">RULE NAME</label>
              <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#00d4ff]/40" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">CONDITION</label>
              <textarea value={editForm.condition} onChange={e => setEditForm(p => ({ ...p, condition: e.target.value }))}
                rows={3}
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 font-mono focus:outline-none focus:border-[#00d4ff]/40 resize-none" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingRule(null)} className="px-4 py-2 text-sm text-gray-400 border border-[#1e2a45] rounded-lg hover:bg-white/5">Cancel</button>
              <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/40 rounded-lg hover:bg-[#00d4ff]/20">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <div className="flex items-start gap-3 mb-5">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">Are you sure you want to delete this automation rule? This action cannot be undone.</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-400 border border-[#1e2a45] rounded-lg hover:bg-white/5">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20">Delete</button>
          </div>
        </Modal>
      )}

      {/* New Rule Modal */}
      {showNewModal && (
        <Modal title="New Automation Rule" onClose={() => setShowNewModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">RULE NAME</label>
              <input value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Block suspicious PowerShell"
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#00d4ff]/40" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">SEVERITY THRESHOLD</label>
              <select value={newRule.severity} onChange={e => setNewRule(p => ({ ...p, severity: e.target.value }))}
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#00d4ff]/40">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">CONDITION</label>
              <textarea value={newRule.condition} onChange={e => setNewRule(p => ({ ...p, condition: e.target.value }))} rows={2} placeholder="alert.severity == 'CRITICAL' AND ..."
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-gray-300 font-mono focus:outline-none focus:border-[#00d4ff]/40 resize-none" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5">ACTION</label>
              <select value={newRule.action} onChange={e => setNewRule(p => ({ ...p, action: e.target.value }))}
                className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#00d4ff]/40">
                {['ISOLATE_HOST', 'KILL_TREE', 'DENY_EXEC', 'PAGE_ON_CALL'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 text-sm text-gray-400 border border-[#1e2a45] rounded-lg hover:bg-white/5">Cancel</button>
              <button onClick={handleAddRule} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/40 rounded-lg hover:bg-[#00d4ff]/20">
                <Plus size={14} /> Add Rule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-[#0f1629] border border-[#1e2a45] rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={16} className="text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
