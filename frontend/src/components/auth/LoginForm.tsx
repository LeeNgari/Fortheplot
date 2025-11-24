
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (roles: string[], username: string) => void;
  onNavigateToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { username: email, password });
      onLoginSuccess(response.data.roles, response.data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-sm">
      <div className="bg-black/70 p-10 rounded-xl border border-gray-800/50 shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">For the Plot</h1>
          <p className="text-gray-300 text-lg">Stream together, anywhere</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm font-medium tracking-wide">EMAIL</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900/80 border-gray-700/50 text-white h-12 rounded-md focus:border-red-500 focus:ring-red-500/50 placeholder:text-gray-500 transition-all"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 text-sm font-medium tracking-wide">PASSWORD</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900/80 border-gray-700/50 text-white h-12 rounded-md focus:border-red-500 focus:ring-red-500/50 placeholder:text-gray-500 transition-all"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold rounded-md transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={onNavigateToRegister}
              className="text-red-400 hover:text-red-300 font-medium transition-colors underline underline-offset-4"
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
