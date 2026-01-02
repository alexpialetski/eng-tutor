import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseClasses =
    'block w-full py-4 bg-primary text-white border-0 text-base cursor-pointer transition-colors duration-300 mt-5 rounded uppercase tracking-wider font-serif';
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary hover:bg-[#3a6346] disabled:bg-gray-300 disabled:cursor-not-allowed'
      : 'bg-secondary hover:bg-[#c77a8a] disabled:bg-gray-300 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

