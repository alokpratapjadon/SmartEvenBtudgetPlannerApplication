import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useAuthStore } from './stores/authStore';
import ErrorMessage from './components/common/ErrorMessage';

function EnvironmentChecker() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requiredEnvVars = {
      'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
      'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'VITE_STRIPE_PUBLISHABLE_KEY': import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      setError(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
          <p className="mt-4 text-sm text-gray-600">
            Please ensure all required environment variables are set in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return <Root />;
}

function Root() {
  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnvironmentChecker />
  </StrictMode>
);