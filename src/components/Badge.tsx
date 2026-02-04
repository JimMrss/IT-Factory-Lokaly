import React from 'react';
import { Star } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'level';
  level?: number;
}

export function Badge({ children, variant = 'neutral', level }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    secondary: 'bg-green-100 text-green-700 border-green-200',
    accent: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    level: 'bg-yellow-50 text-yellow-900 border-yellow-200'
  };

  const renderStars = (lvl: number) => {
    const clamped = Math.min(Math.max(lvl, 0), 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < clamped ? 'text-yellow-500 fill-yellow-400' : 'text-yellow-300'}
      />
    ));
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border whitespace-nowrap flex-shrink-0 ${variantClasses[variant]}`}>
      {variant === 'level' && level != null ? (
        <span className="inline-flex items-center gap-0.5">{renderStars(level)}</span>
      ) : (
        children
      )}
    </span>
  );
}
