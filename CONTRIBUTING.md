# Contributing to Internee.pk EDR Console

First off — thank you for taking the time to contribute! 🎉  
Every contribution, big or small, makes this project better.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 🤝 Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive to all contributors
- Accept constructive feedback gracefully
- Focus on what is best for the community
- Show empathy towards other contributors

Harassment, discrimination, or toxic behavior of any kind 
will not be tolerated.

---

## 💡 How Can I Contribute?

### 🐛 Bug Fixes
Found something broken? Fix it and open a PR.

### ✨ New Features
Check the Roadmap in README.md first to see what's planned. 
Feel free to pick one up or suggest your own.

### 📝 Documentation
Improve the README, add JSDoc comments, or write 
better inline explanations.

### 🎨 UI / UX Improvements
Better layouts, animations, responsiveness, 
or accessibility improvements are always welcome.

### 🧪 Tests
We have no tests yet — adding any is a huge help.

---

## 🚀 Getting Started

```bash
# 1. Fork this repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/internee-edr-console.git

# 3. Add the original repo as upstream
git remote add upstream https://github.com/ORIGINAL-USERNAME/internee-edr-console.git

# 4. Install dependencies
npm install

# 5. Create a new branch for your work
git checkout -b feature/your-feature-name

# 6. Start the dev server
npm run dev
```

---

## 🌿 Branch Naming

Use these prefixes:

| Type | Format | Example |
|---|---|---|
| New feature | `feature/` | `feature/watch-floor-tiles` |
| Bug fix | `fix/` | `fix/quarantine-button-state` |
| UI improvement | `ui/` | `ui/alert-drawer-redesign` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/mock-data-structure` |
| Tests | `test/` | `test/auth-flow` |

---

## ✍️ Commit Message Format

We follow **Conventional Commits**:

---

## 🔁 Pull Request Process

1. **Sync with upstream** before opening a PR:
```bash
   git fetch upstream
   git rebase upstream/main
```

2. **Make sure the app runs** without errors:
```bash
   npm run dev
   npm run build
```

3. **Open your PR** against the `main` branch

4. **Fill in the PR template** — describe:
   - What you changed
   - Why you changed it
   - Screenshots (for UI changes)
   - Any known issues or limitations

5. **Wait for review** — a maintainer will review within 48–72 hours

6. **Address feedback** — push additional commits to the same branch

7. **Squash and merge** will be used to keep history clean

---

## 🎨 Style Guidelines

### React
- Use **functional components** only (no class components)
- Use **hooks** for all state and side effects
- Keep components **small and focused** (one responsibility)
- Put reusable logic in `/hooks/`
- Put mock data in `/data/mockData.js`

### Tailwind CSS
- Use the project's **design tokens** (see README color system)
- Avoid arbitrary values like `w-[347px]` — use scale values
- Keep className strings readable — break long ones into multiple lines

### JavaScript
- Use **ES6+** syntax
- Prefer `const` over `let`, avoid `var`
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`)
- No commented-out dead code in PRs

### File Naming
- Components: `PascalCase.jsx` (e.g., `AlertDrawer.jsx`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useLocalStorage.js`)
- Data files: `camelCase.js` (e.g., `mockData.js`)

---

## 🐛 Reporting Bugs

Open a GitHub Issue and include:
Bug Description
A clear and concise description of the bug.
Steps to Reproduce

Go to '...'
Click on '...'
See error

Expected Behavior
What you expected to happen.
Actual Behavior
What actually happened.
Screenshots
If applicable, add screenshots.
Environment

OS: [e.g. Windows 11]
Browser: [e.g. Chrome 124]
Node version: [e.g. 18.17.0]
---

## 💬 Suggesting Features

Open a GitHub Issue with the label `enhancement` and include:
Feature Summary
One-line description of the feature.
Problem it Solves
What pain point or gap does this address?
Proposed Solution
How should it work? Any UI ideas?
Alternatives Considered
Other approaches you thought about.
Additional Context
Mockups, references, links — anything helpful.

---

## 🙏 Thank You

Every contribution matters.  
Whether it's fixing a typo or building a full new page —  
you're helping make this a better learning resource  
for cybersecurity students everywhere.

> Built for the Internee.pk Cybersecurity Track 🛡️
