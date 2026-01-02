import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`w-full max-w-[700px] bg-paper p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-2 border-primary relative overflow-hidden mx-auto before:content-['✿'] before:absolute before:top-2.5 before:left-2.5 before:text-2xl before:text-secondary before:opacity-60 after:content-['✿'] after:absolute after:bottom-2.5 after:right-2.5 after:text-2xl after:text-secondary after:opacity-60 [&>h1]:text-center [&>h1]:text-primary [&>h1]:font-normal [&>h1]:mb-2.5 [&>h1]:tracking-wider [&>h1]:border-b [&>h1]:border-accent [&>h1]:pb-5 ${className}`}
    >
      {children}
    </div>
  );
};

