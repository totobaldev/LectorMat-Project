import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type ActionButtonVariant = 'student' | 'teacher' | 'success' | 'secondary' | 'ghost';
type ActionButtonSize = 'sm' | 'md' | 'lg';

interface ActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variants: Record<ActionButtonVariant, string> = {
  student: 'bg-blue-600 text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.8)] hover:bg-blue-700 focus-visible:ring-blue-500',
  teacher: 'bg-orange-500 text-white shadow-[0_10px_24px_-10px_rgba(249,115,22,0.8)] hover:bg-orange-600 focus-visible:ring-orange-500',
  success: 'bg-emerald-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.75)] hover:bg-emerald-600 focus-visible:ring-emerald-500',
  secondary: 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
};

const sizes: Record<ActionButtonSize, string> = {
  sm: 'min-h-10 px-4 py-2 text-xs rounded-xl',
  md: 'min-h-12 px-5 py-3 text-sm rounded-2xl',
  lg: 'min-h-14 px-7 py-4 text-sm rounded-2xl',
};

export function ActionButton({
  variant = 'student',
  size = 'md',
  leading,
  trailing,
  fullWidth = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}: ActionButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={!disabled && !reduceMotion ? { y: -2 } : undefined}
      whileTap={!disabled && !reduceMotion ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center gap-2.5 font-extrabold transition-colors duration-200 outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {leading && <span className="shrink-0" aria-hidden="true">{leading}</span>}
      <span>{children}</span>
      {trailing && <span className="shrink-0" aria-hidden="true">{trailing}</span>}
    </motion.button>
  );
}
