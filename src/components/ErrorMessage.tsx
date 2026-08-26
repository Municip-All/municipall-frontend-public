import React from 'react';
import { Button } from './Button';
import './ErrorMessage.scss';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => (
  <div className={`error-message ${className}`}>
    <div className="error-message__icon">⚠️</div>
    <p className="error-message__text">{message}</p>
    {onRetry && (
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
);
