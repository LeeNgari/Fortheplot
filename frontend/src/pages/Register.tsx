
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import BackgroundImage from '@/components/auth/BackgroundImage';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BackgroundImage />
      <RegisterForm onNavigateToLogin={handleNavigateToLogin} />
    </div>
  );
};

export default Register;
