import React from 'react';

type StatusBadgeTone = 'blue' | 'orange' | 'emerald' | 'amber' | 'slate';

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
  icon?: React.ReactNode;
  className?: string;
}

const tones: Record<StatusBadgeTone, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  orange: 'bg-orange-50 text-orange-700 ring-orange-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatusBadge({ children, tone = 'slate', icon, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ring-1 ring-inset ${tones[tone]} ${className}`}>
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

