import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api';

interface LoginProps {
  onLogin: (roles: string[]) => void;
  onNavigate: () => void;
}

const backgroundImages = [
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=1080&fit=crop',
];

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % backgroundImages.length);
        setTransitioning(false);
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, [nextImageIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { username: email, password });
      onLogin(response.data.roles);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Images with Transition */}
      <div className="absolute inset-0">
        {/* Current Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'opacity 2s ease-in-out',
          }}
        />
        
        {/* Next Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${transitioning ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%), url(${backgroundImages[nextImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'opacity 2s ease-in-out',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-sm">
        <div className="bg-black/70 p-10 rounded-xl border border-gray-800/50 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">WatchParty</h1>
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
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold rounded-md transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={onNavigate}
                className="text-red-400 hover:text-red-300 font-medium transition-colors underline underline-offset-4"
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;