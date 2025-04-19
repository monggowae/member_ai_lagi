import React from 'react';
import { Input } from './Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

export function FormField({ 
  label, 
  error, 
  icon, 
  helper,
  className = '',
  ...props 
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        icon={icon}
        error={error}
        className={className}
        {...props}
      />
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}