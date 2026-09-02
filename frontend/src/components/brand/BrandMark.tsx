import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
  markClassName?: string;
}

export function BrandMark({ compact = false, className = '', markClassName = 'h-11 w-11' }: BrandMarkProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="LectorMat">
      <svg className={`${markClassName} shrink-0`} viewBox="0 0 52 52" role="img" aria-hidden="true">
        <rect x="2" y="2" width="48" height="48" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
        <path d="M10.5 17.5c6-1.8 11-.7 15.5 3v20c-4.5-3.7-9.5-4.8-15.5-3Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M41.5 17.5c-6-1.8-11-.7-15.5 3v20c4.5-3.7 9.5-4.8 15.5-3Z" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M18 26h5m-2.5-2.5v5" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
        <path d="m31 24 5 6m0-6-5 6" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
        <path d="m38.5 9 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z" fill="#10B981" />
      </svg>
      {!compact && (
        <span className="text-[1.35rem] font-black tracking-[-0.035em] text-slate-950 leading-none">
          Lector<span className="text-orange-500">Mat</span>
        </span>
      )}
    </div>
  );
}

