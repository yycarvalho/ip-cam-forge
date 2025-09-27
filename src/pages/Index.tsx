import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/security/LoginForm';
import SecurityDashboard from '@/components/security/SecurityDashboard';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <SecurityDashboard />;
};

export default Index;
