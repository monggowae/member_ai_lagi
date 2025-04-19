import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <AuthForm
        mode={mode}
        onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
      />
    </div>
  );
}