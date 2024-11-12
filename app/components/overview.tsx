import React from 'react';

interface OverviewProps {
  className?: string;
}

export const Overview: React.FC<OverviewProps> = ({ className }) => {
  return (
    <div 
      className={`
        rounded-xl 
        p-6 
        flex 
        flex-col 
        gap-8 
        leading-relaxed 
        text-center 
        max-w-xl
        mx-auto
        text-white
        ${className || ''}
      `}
    >
      <p>
        Welcome to{' '}
        <span className="font-semibold">
          Your Product Name
        </span>{' '}
        . I’m here to help you with whatever you need—whether it's answering questions, resolving issues, or guiding you through solutions.
      </p>
      <p>
        Let’s get started! What can I help you with today?
      </p>
    </div>
  );
};