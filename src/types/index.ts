export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'Open' | 'Investigating' | 'Resolved';
export type EndpointStatus = 'HEALTHY' | 'ALERTING' | 'INVESTIGATING' | 'OFFLINE' | 'QUARANTINED';

export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  mitreId: string;
  mitreTactic: string;
  host: string;
  user: string;
  ip: string;
  sha256: string;
  tags: string[];
  severity: Severity;
  status: AlertStatus;
  description: string;
  timeline: { time: string; event: string }[];
  recommendedActions: string[];
}

export interface Endpoint {
  id: string;
  host: string;
  os: string;
  ip: string;
  processes: number;
  status: EndpointStatus;
  lastSeen: string;
  cpu: number;
  ram: number;
  uptime: string;
  offlineSince?: string;
  offlineReason?: string;
  alerts: string[];
  runningProcesses: string[];
}

export interface ThreatEntry {
  id: string;
  sha256: string;
  malwareName: string;
  tags: string[];
  dateAdded: string;
  confidence: number;
  blocked: boolean;
}

export interface MitreCell {
  tacticId: string;
  techniqueId: string;
  techniqueName: string;
  description: string;
  status: 'detected' | 'rule' | 'none';
  alerts: string[];
  detectionRule: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  fired: number;
}

export interface AlertRule {
  id: string;
  name: string;
  channels: { email: boolean; slack: boolean; sms: boolean; webhook: boolean };
}

export interface FIMEvent {
  id: string;
  timestamp: string;
  host: string;
  filePath: string;
  user: string;
  changeType: string;
  diffAdded: string[];
  diffRemoved: string[];
  status: 'ACTIVE' | 'REVERTED';
}

export interface UserEvent {
  id: string;
  timestamp: string;
  username: string;
  host: string;
  action: string;
  ip: string;
  riskScore: 'Low' | 'Medium' | 'High';
  details: string;
}
