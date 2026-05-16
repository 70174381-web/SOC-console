import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Alert, Endpoint, ThreatEntry, AutomationRule, AlertRule, FIMEvent } from '../types';
import { MOCK_ALERTS, MOCK_ENDPOINTS, MOCK_THREATS, MOCK_AUTOMATION_RULES, MOCK_ALERT_RULES, MOCK_FIM_EVENTS } from '../data/mockData';

interface AppStateContextType {
  alerts: Alert[];
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  quarantineHost: (host: string) => void;
  endpoints: Endpoint[];
  threats: ThreatEntry[];
  blockThreatHash: (id: string) => void;
  automationRules: AutomationRule[];
  toggleRule: (id: string) => void;
  updateRule: (id: string, name: string, condition: string) => void;
  deleteRule: (id: string) => void;
  addRule: (rule: Omit<AutomationRule, 'id' | 'fired'>) => void;
  alertRules: AlertRule[];
  toggleAlertRuleChannel: (ruleId: string, channel: keyof AlertRule['channels']) => void;
  notifChannels: { email: string; slack: string; sms: string; webhook: string };
  updateNotifChannel: (key: keyof AppStateContextType['notifChannels'], value: string) => void;
  fimEvents: FIMEvent[];
  revertFimEvent: (id: string) => void;
  dispatchLog: DispatchEntry[];
  addDispatchLog: (entry: Omit<DispatchEntry, 'id'>) => void;
}

export interface DispatchEntry {
  id: string;
  timestamp: string;
  rule: string;
  channel: string;
  target: string;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(() => load('edr_alerts', MOCK_ALERTS));
  const [endpoints, setEndpoints] = useState<Endpoint[]>(() => load('edr_endpoints', MOCK_ENDPOINTS));
  const [threats, setThreats] = useState<ThreatEntry[]>(() => load('edr_threats', MOCK_THREATS));
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => load('edr_auto_rules', MOCK_AUTOMATION_RULES));
  const [alertRules, setAlertRules] = useState<AlertRule[]>(() => load('edr_alert_rules', MOCK_ALERT_RULES));
  const [notifChannels, setNotifChannels] = useState(() => load('edr_notif_channels', {
    email: 'soc-team@internee.pk',
    slack: '#sec-alerts',
    sms: '',
    webhook: 'https://hooks.example.com/soc',
  }));
  const [fimEvents, setFimEvents] = useState<FIMEvent[]>(() => load('edr_fim', MOCK_FIM_EVENTS));
  const [dispatchLog, setDispatchLog] = useState<DispatchEntry[]>(() => load('edr_dispatch_log', [
    { id: 'DL-001', timestamp: '2024-05-15 09:14:35', rule: 'Auto-isolate on ransomware', channel: 'Slack', target: '#sec-alerts' },
    { id: 'DL-002', timestamp: '2024-05-15 08:55:12', rule: 'Quarantine LOLBin chains', channel: 'Email', target: 'soc-team@internee.pk' },
    { id: 'DL-003', timestamp: '2024-05-15 07:30:46', rule: 'Alert on FIM /etc/* changes', channel: 'SMS', target: 'on-call' },
    { id: 'DL-004', timestamp: '2024-05-15 06:15:22', rule: 'Block hash from MalwareBazaar', channel: 'Webhook', target: 'SIEM' },
    { id: 'DL-005', timestamp: '2024-05-15 05:48:05', rule: 'High Severity Alert', channel: 'Email', target: 'soc-team@internee.pk' },
    { id: 'DL-006', timestamp: '2024-05-14 23:10:11', rule: 'Critical Severity Alert', channel: 'Slack', target: '#sec-alerts' },
    { id: 'DL-007', timestamp: '2024-05-14 21:05:33', rule: 'Ransomware Detection', channel: 'SMS', target: 'on-call' },
    { id: 'DL-008', timestamp: '2024-05-14 18:44:09', rule: 'Credential Access Attempt', channel: 'Email', target: 'soc-team@internee.pk' },
    { id: 'DL-009', timestamp: '2024-05-14 15:30:00', rule: 'Lateral Movement Detected', channel: 'Webhook', target: 'SIEM' },
    { id: 'DL-010', timestamp: '2024-05-14 12:00:01', rule: 'High Severity Alert', channel: 'Slack', target: '#sec-alerts' },
  ]));

  useEffect(() => { save('edr_alerts', alerts); }, [alerts]);
  useEffect(() => { save('edr_endpoints', endpoints); }, [endpoints]);
  useEffect(() => { save('edr_threats', threats); }, [threats]);
  useEffect(() => { save('edr_auto_rules', automationRules); }, [automationRules]);
  useEffect(() => { save('edr_alert_rules', alertRules); }, [alertRules]);
  useEffect(() => { save('edr_notif_channels', notifChannels); }, [notifChannels]);
  useEffect(() => { save('edr_fim', fimEvents); }, [fimEvents]);
  useEffect(() => { save('edr_dispatch_log', dispatchLog); }, [dispatchLog]);

  const updateAlertStatus = (id: string, status: Alert['status']) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const quarantineHost = (host: string) => {
    setEndpoints(prev => prev.map(ep => ep.host === host ? { ...ep, status: 'QUARANTINED' } : ep));
  };

  const blockThreatHash = (id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, blocked: true } : t));
  };

  const toggleRule = (id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateRule = (id: string, name: string, condition: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, name, condition } : r));
  };

  const deleteRule = (id: string) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
  };

  const addRule = (rule: Omit<AutomationRule, 'id' | 'fired'>) => {
    const newRule: AutomationRule = { ...rule, id: `AR-${Date.now()}`, fired: 0 };
    setAutomationRules(prev => [...prev, newRule]);
  };

  const toggleAlertRuleChannel = (ruleId: string, channel: keyof AlertRule['channels']) => {
    setAlertRules(prev => prev.map(r => r.id === ruleId
      ? { ...r, channels: { ...r.channels, [channel]: !r.channels[channel] } }
      : r
    ));
  };

  const updateNotifChannel = (key: keyof typeof notifChannels, value: string) => {
    setNotifChannels(prev => ({ ...prev, [key]: value }));
  };

  const revertFimEvent = (id: string) => {
    setFimEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'REVERTED' } : e));
  };

  const addDispatchLog = (entry: Omit<DispatchEntry, 'id'>) => {
    setDispatchLog(prev => [{ ...entry, id: `DL-${Date.now()}` }, ...prev.slice(0, 19)]);
  };

  return (
    <AppStateContext.Provider value={{
      alerts, updateAlertStatus, quarantineHost,
      endpoints, threats, blockThreatHash,
      automationRules, toggleRule, updateRule, deleteRule, addRule,
      alertRules, toggleAlertRuleChannel,
      notifChannels, updateNotifChannel,
      fimEvents, revertFimEvent,
      dispatchLog, addDispatchLog,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState outside AppStateProvider');
  return ctx;
}
