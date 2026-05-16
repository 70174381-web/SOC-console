# SOC-console

[WEBSITE](https://internee-pk-edr-soc-c41z.bolt.host/dashboard)

# 🛡️ Internee.pk EDR — Endpoint Detection & Response Console

> A real-time SOC (Security Operations Center) dashboard built for 
> monitoring, detecting, and responding to endpoint threats across 
> an organization's infrastructure.

![Version](https://img.shields.io/badge/version-2.4.1-cyan)
![Build](https://img.shields.io/badge/build-stable-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Tailwind-blueviolet)

---

## 📌 Overview

**Internee.pk EDR** is a frontend SOC console that simulates an 
enterprise-grade Endpoint Detection & Response platform. It was 
built as part of the Internee.pk cybersecurity internship program 
to demonstrate real-world SOC workflows, MITRE ATT&CK coverage, 
threat intelligence integration, and automated incident response.

---

## ✨ Features

### 🔐 Authentication
- Secure login with username, password, and MFA
- Session persistence via localStorage
- Role-based display (SOC Analyst L1 / L2 / L3)

### 📊 Live Console
- Real-time alert triage with severity filtering (Critical / High / Medium / Low)
- Keyword and host-based alert search
- Alert detail drawer with investigation timeline
- One-click Quarantine and Investigate actions
- Live Sysmon log stream with pause, scroll-lock, and export

### 🖥️ Endpoint Fleet
- Full host inventory table with OS, IP, status, and last seen
- Per-host detail panel: CPU, RAM, processes, recent alerts
- Actions: Isolate, Run Scan, Restart Agent
- OFFLINE host diagnostics with timeout reason

### 🦠 Threat Intelligence
- MalwareBazaar feed integration (mock)
- SHA256 hash lookup, copy, block, and external link
- Blocked hashes list with live sync status

### 🗺️ MITRE ATT&CK Mapping
- Visual heatmap across all 12 tactics
- Color-coded coverage: detected / rule exists / no coverage
- 82.1% technique coverage displayed
- Click-through to technique detail and linked alerts

### ⚙️ Automation Rules
- Pre-built response rules: ISOLATE_HOST, KILL_TREE, DENY_EXEC, PAGE_ON_CALL
- Create, edit, enable/disable, and delete rules
- Notification routing: Email, Slack, SMS, Webhook
- Live dispatch log with test-fire support

### 📁 File Integrity Monitor
- Real-time diff view of file changes (added/removed lines)
- Monitored paths panel
- Revert with confirmation modal
- Filter by host, path, or user

### 👤 User Activity
- Off-hours logins, failed auth, privilege escalation tracking
- Risk scoring per event (Low / Medium / High)
- Filter by risk level, username, date range

### 👁️ Watch Floor
- 2×4 host tile grid with live status
- Animated CPU/RAM usage bars
- Pulsing alert indicator for ALERTING hosts

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React useState + localStorage |
| Fonts | JetBrains Mono, Inter |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/internee-edr-console.git

# Navigate into the project
cd internee-edr-console

# Install dependencies
npm install

# Start the development server
npm run dev
```



### Login Credentials (Demo)

Username : admin
Password : internee2024
MFA Code : any 6-digit number

---

## 📁 Project Structure
src/
├── components/
│   ├── Auth/           # Login screen, MFA
│   ├── Layout/         # Sidebar, Topbar, Toast
│   ├── Dashboard/      # Alert triage, Sysmon log
│   ├── Endpoints/      # Fleet table, Host detail
│   ├── Threats/        # MalwareBazaar intel
│   ├── MITRE/          # ATT&CK heatmap
│   ├── Automation/     # Rules, notification channels
│   ├── FIM/            # File integrity diff view
│   ├── UserActivity/   # User event table
│   └── WatchFloor/     # Host tile grid
├── data/
│   └── mockData.js     # All simulated data
├── hooks/
│   └── useLocalStorage.js
├── App.jsx
└── main.jsx

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0a0e1a` |
| Card | `#0f1629` |
| Border | `#1e2a45` |
| Accent (Cyan) | `#00d4ff` |
| Critical | `#ff4444` |
| High | `#ff8800` |
| Medium | `#ffcc00` |
| Low | `#44ff88` |

---

## 📸 Screenshots

| Console | MITRE Mapping |
|---|---|
| ![console](./screenshots/console.png) | ![mitre](./screenshots/mitre.png) |

| Endpoint Fleet | Watch Floor |
|---|---|
| ![fleet](./screenshots/fleet.png) | ![watchfloor](./screenshots/watchfloor.png) |

---

## 🔮 Roadmap

- [ ] Real Wazuh API integration
- [ ] Live MalwareBazaar API connection
- [ ] WebSocket-based real alert streaming
- [ ] PostgreSQL backend for alert persistence
- [ ] Export alerts to PDF / CSV
- [ ] Incident ticketing (Jira / ServiceNow integration)
- [ ] Multi-analyst collaboration mode
- [ ] Mobile-responsive Watch Floor

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 👨‍💻 Built By

**Fidia Batool**  
Cybersecurity Intern @ [Internee.pk](https://internee.pk)  
[LinkedIn](https://www.linkedin.com/in/fidia-batool-059018254/) · 
[GitHub](https://github.com/70174381-web)

---

## 📄 License

This project is licensed under the MIT License.  
See [LICENSE](./LICENSE.mit) for details.

---

## ⚠️ Disclaimer

This is a **demo/simulation** dashboard built for educational purposes 
as part of an internship program. All threat data, endpoints, hashes, 
and alerts are entirely fictional mock data. This is not connected to 
any real infrastructure.

---

> Built with ❤️ for the Internee.pk Cybersecurity Track
>
> 
