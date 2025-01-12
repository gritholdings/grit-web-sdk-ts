import React from 'react';
import { Labels } from '@/agent-app/labels';

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
        ${className || ''}
      `}
    >
      <p>
        {Labels.OVERVIEW_TEXT}
      </p>
    </div>
  );
};