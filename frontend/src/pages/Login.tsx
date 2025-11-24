
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import BackgroundImage from '@/components/auth/BackgroundImage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = (roles: string[], username: string) => {
    login(roles, username);
    navigate('/home');
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BackgroundImage />
      <LoginForm onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />
    </div>
  );
};

export default Login;
