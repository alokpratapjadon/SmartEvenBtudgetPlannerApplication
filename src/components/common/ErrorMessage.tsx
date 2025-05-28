import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md flex items-start mb-4 animate-fadeIn">
      <AlertTriangle className="h-5 w-5 text-error-400 mr-3 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;