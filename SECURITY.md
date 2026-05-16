# Security Policy

## ⚠️ Important Disclaimer

This project is a **frontend simulation dashboard** built for 
educational purposes as part of the Internee.pk cybersecurity 
internship program.

- All threat data, SHA256 hashes, endpoints, IP addresses, 
  and alerts are **entirely fictional mock data**
- This application is **not connected** to any real infrastructure, 
  live APIs, or production systems
- Credentials stored in this demo (localStorage) are for 
  **demonstration only** and have **no real security implications**

---

## 📦 Supported Versions

| Version | Supported |
|---|---|
| 2.4.x (stable) | ✅ Active |
| 2.3.x | ⚠️ Security fixes only |
| < 2.3 | ❌ Not supported |

---

## 🔍 Scope

### In Scope
If you find any of the following in this project, please report it:

- **XSS vulnerabilities** in any user input fields
- **Dependency vulnerabilities** in `package.json` 
  (outdated packages with known CVEs)
- **Exposed secrets or API keys** accidentally committed to the repo
- **Insecure localStorage usage** that could be exploited 
  in a real deployment context
- **CSRF or injection issues** in any form handling logic
- **Broken authentication logic** that bypasses the login screen 
  in unintended ways

### Out of Scope
- Vulnerabilities in the **mock/simulated data** itself 
  (it's fake by design)
- Issues that only exist if the app were connected to a 
  real backend (it isn't)
- Social engineering attacks
- Denial of service against the demo deployment
- Issues in third-party libraries that have no realistic 
  exploit path in this app

---

## 📬 Reporting a Vulnerability

**Please do NOT open a public GitHub Issue for security vulnerabilities.**

Instead, report privately using one of these methods:

### Option 1 — GitHub Private Advisory (Preferred)
1. Go to the **Security** tab of this repository
2. Click **"Report a vulnerability"**
3. Fill in the details of the issue

### Option 2 — Email
Send a report to: mailto:security@internee.pk
Include in your report:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Your suggested fix (optional but appreciated)

---

## ⏱️ Response Timeline

| Stage | Timeframe |
|---|---|
| Acknowledgement of report | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation | Within 14 days (critical), 30 days (others) |
| Public disclosure | After fix is deployed |

We follow **responsible disclosure** — we ask that you give us 
reasonable time to fix the issue before making it public.

---

## 🏆 Recognition

We don't have a formal bug bounty program, but we genuinely 
appreciate responsible disclosure.

Valid reporters will be:
- Credited in the project's `CONTRIBUTORS.md`
- Mentioned in the release notes for the fix
- Thanked publicly (with your permission)

---

## 🔐 Security Best Practices for Deployers

If you fork or deploy this project:

1. **Change default credentials** — never use `admin / internee2024` 
   in any real environment
2. **Do not connect real infrastructure** without adding proper 
   backend authentication and authorization
3. **Audit dependencies** before deploying: `npm audit`
4. **Use HTTPS** — never serve this over plain HTTP
5. **Sanitize all inputs** if extending with a real backend
6. **Do not store real credentials** in localStorage in production — 
   use secure, httpOnly cookies instead

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)
- [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)

---

> This security policy applies to the source code in this repository.  
> Internee.pk EDR is a simulation tool — use responsibly. 🛡️
