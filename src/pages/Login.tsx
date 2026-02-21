import { Lock } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../api';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.login(username, password);
      onLogin();
      navigate('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 p-10 rounded-2xl border border-primary/10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Lock className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm">Access the management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">{error}</div>}
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary/60 uppercase tracking-widest">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-primary/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary/60 uppercase tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-primary/10 rounded-lg py-3 px-4 text-white focus:border-primary outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-dark font-black py-4 rounded-lg hover:bg-primary/90 transition-all shadow-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          Back to Website
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
