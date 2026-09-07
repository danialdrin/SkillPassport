import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { TopBar } from '../components/layout/TopBar';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <TopBar />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <RegisterForm />
      </div>
    </div>
  );
};
