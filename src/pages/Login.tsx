import { useState } from 'react';
import { ShieldAlert, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfa, setMfa] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password, mfa);
      if (!ok) setError('Invalid credentials or MFA code. Use admin / internee2024 + any 6-digit code.');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-[#0f1629] border border-[#1e2a45] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-[#00d4ff]/10 to-transparent border-b border-[#1e2a45] px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/30 flex items-center justify-center">
                <ShieldAlert className="text-[#00d4ff]" size={24} />
              </div>
              <div>
                <div className="text-white font-bold text-lg tracking-wide">INTERNEE.PK</div>
                <div className="text-[#00d4ff] text-xs font-mono tracking-widest">EDR SOC CONSOLE</div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="mb-6">
              <h1 className="text-white text-xl font-semibold">Analyst Authentication</h1>
              <p className="text-gray-500 text-sm mt-1">Secure access — authorized personnel only</p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 font-mono uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="analyst.username"
                  className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-4 py-2.5 text-gray-200 text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]/60 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 font-mono uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-4 py-2.5 pr-10 text-gray-200 text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]/60 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 font-mono uppercase tracking-wider">MFA Code</label>
                <input
                  type="text"
                  value={mfa}
                  onChange={e => setMfa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  className="w-full bg-[#0a0e1a] border border-[#1e2a45] rounded-lg px-4 py-2.5 text-gray-200 text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#00d4ff]/60 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all tracking-[0.3em]"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00d4ff] hover:bg-[#00b8d9] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a0e1a] font-bold py-2.5 rounded-lg transition-all text-sm tracking-wide mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Authenticating...
                  </span>
                ) : 'Authenticate'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#1e2a45]">
              <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                System Online · TLS 1.3 · 2FA Required
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[10px] text-gray-700 font-mono">
          v2.4.1-stable · {new Date().toLocaleDateString('en-CA')} · INTERNEE.PK SECURITY OPS
        </div>
      </div>
    </div>
  );
}
