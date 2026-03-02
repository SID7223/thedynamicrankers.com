import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InternalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In production, fetch to /api/internal/auth
      // const response = await fetch('/api/internal/auth', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) navigate('/internal/dashboard');
      // else setError(data.error);

      // For now, mock a successful login
      if ((email === 'saadumar7223@gmail.com' || email === 'eric@thedynamicrankers.com') && password === '123456') {
        navigate('/internal/dashboard');
      } else {
        setError('UNAUTHORIZED ACCESS DETECTED.');
      }
    } catch (err) {
      setError('INITIALIZATION ERROR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 space-y-8 font-mono text-zinc-400">
      <div className="space-y-2 text-center">
        <h1 className="text-zinc-200 text-lg font-bold tracking-[0.2em] uppercase">The Dynamic Rankers</h1>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest animate-pulse">COMMAND CENTER v1.0 / CLOUDFLARE_EDGE</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-600">IDENTITY_EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono rounded"
              placeholder="user@thedynamicrankers.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-600">CRYPTO_KEY</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono rounded"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center animate-bounce">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all uppercase tracking-[0.2em] font-bold group disabled:opacity-50"
        >
          {loading ? 'VERIFYING...' : 'INITIATE_HANDSHAKE'}
          {!loading && <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>}
        </button>
      </form>

      <div className="text-center space-y-2 opacity-30">
        <p className="text-[9px] uppercase tracking-widest">ENCRYPTED_TUNNEL: ACTIVE</p>
        <p className="text-[9px] uppercase tracking-widest">LOCATION_OBFUSCATION: ENABLED</p>
      </div>
    </div>
  );
};

export default InternalLogin;
