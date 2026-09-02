import React from 'react';

export type LectorMatIconName =
  | 'home'
  | 'reading'
  | 'math'
  | 'courses'
  | 'method'
  | 'missions'
  | 'progress'
  | 'challenge'
  | 'achievements'
  | 'teacher'
  | 'feedback'
  | 'library'
  | 'statistics'
  | 'career'
  | 'reward'
  | 'skills';

interface LectorMatIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: LectorMatIconName;
  size?: number | string;
  title?: string;
}

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const glyphs: Record<LectorMatIconName, React.ReactNode> = {
  home: (
    <>
      <path {...common} d="M8 22.5 24 9l16 13.5V39a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z" />
      <path {...common} d="M17 42V29c4.7-1.6 9.3-1.6 14 0v13M17 29c2.5.2 4.9 1 7 2.4 2.1-1.4 4.5-2.2 7-2.4" />
    </>
  ),
  reading: (
    <>
      <path {...common} d="M6.5 12.5c6.8-2 12.6-.8 17.5 3.5v24c-4.9-4.3-10.7-5.5-17.5-3.5Z" />
      <path {...common} d="M41.5 12.5C34.7 10.5 28.9 11.7 24 16v24c4.9-4.3 10.7-5.5 17.5-3.5Z" />
      <path {...common} d="m35.5 5 .9 2.6L39 8.5l-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z" />
    </>
  ),
  math: (
    <>
      <rect {...common} x="7" y="8" width="34" height="32" rx="9" />
      <path {...common} d="M14 19h9M18.5 14.5v9M29 15l7 8M36 15l-7 8M14 31h9M29 31h7M32.5 27.5v7" />
    </>
  ),
  courses: (
    <>
      <path {...common} d="M9 9h23a6 6 0 0 1 6 6v24H15a6 6 0 0 1-6-6Z" />
      <path {...common} d="M15 39a6 6 0 0 1 0-12h23M16 16h13M16 21h9" />
      <path {...common} d="M33 8v12l-4-2.6-4 2.6V9" />
    </>
  ),
  method: (
    <>
      <rect {...common} x="18" y="5" width="12" height="9" rx="3" />
      <rect {...common} x="5" y="34" width="12" height="9" rx="3" />
      <rect {...common} x="31" y="34" width="12" height="9" rx="3" />
      <path {...common} d="M24 14v9M11 34v-5a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6v5" />
      <circle cx="24" cy="23" r="2.5" fill="currentColor" />
    </>
  ),
  missions: (
    <>
      <path {...common} d="M12 42V10M13 11c8-6 14 6 24 0v18c-10 6-16-6-24 0" />
      <path {...common} d="m29 16 1.6 3.2 3.5.5-2.5 2.5.6 3.5-3.2-1.6-3.2 1.6.6-3.5-2.5-2.5 3.5-.5Z" />
    </>
  ),
  progress: (
    <>
      <path {...common} d="M7 38c7-1 7-9 14-10s7-10 14-11" />
      <circle cx="8" cy="38" r="3.5" fill="currentColor" />
      <circle cx="21" cy="28" r="3.5" fill="currentColor" />
      <path {...common} d="m36 7 1.8 4 4.2.5-3.1 2.9.8 4.2-3.7-2.1-3.7 2.1.8-4.2-3.1-2.9 4.2-.5Z" />
    </>
  ),
  challenge: (
    <>
      <circle {...common} cx="24" cy="25" r="15" />
      <circle {...common} cx="24" cy="25" r="8" />
      <circle cx="24" cy="25" r="3" fill="currentColor" />
      <path {...common} d="m27 22 12-12M34 10h5v5" />
    </>
  ),
  achievements: (
    <>
      <circle {...common} cx="24" cy="21" r="13" />
      <path {...common} d="m16 32-2 11 10-5 10 5-2-11" />
      <path {...common} d="M18 19.5c4-2.4 8-2.4 12 0v7c-4-2.4-8-2.4-12 0Z" />
      <path {...common} d="M24 19.5v7" />
    </>
  ),
  teacher: (
    <>
      <rect {...common} x="6" y="9" width="36" height="25" rx="6" />
      <path {...common} d="M16 41h16M24 34v7M15 18h7l-7 8h7M28 18h7M31.5 14.5v7" />
    </>
  ),
  feedback: (
    <>
      <path {...common} d="M8 10h32v25H23l-9 7v-7H8Z" />
      <path {...common} d="M15 20h18M15 26h12" />
      <circle cx="35" cy="26" r="2" fill="currentColor" />
    </>
  ),
  library: (
    <>
      <path {...common} d="M7 40h34M10 35V13h8v22M20 35V8h8v27M30 35V16h8v19" />
      <path {...common} d="M11 19h6M21 15h6M31 23h6" />
    </>
  ),
  statistics: (
    <>
      <path {...common} d="M8 40V25h8v15M20 40V16h8v24M32 40V8h8v32" />
      <path {...common} d="m8 18 9-6 8 3 13-9" />
    </>
  ),
  career: (
    <>
      <path {...common} d="m5 18 19-9 19 9-19 9Z" />
      <path {...common} d="M13 23v10c7 5 15 5 22 0V23M43 18v13" />
      <circle cx="43" cy="34" r="2" fill="currentColor" />
    </>
  ),
  reward: (
    <>
      <rect {...common} x="7" y="19" width="34" height="23" rx="5" />
      <path {...common} d="M24 19v23M6 19h36v-8H6ZM24 11c-5-8-13-4-10 0 2 3 6 2 10 0Zm0 0c5-8 13-4 10 0-2 3-6 2-10 0Z" />
    </>
  ),
  skills: (
    <>
      <path {...common} d="M20 8a8 8 0 0 0-8 8v1a7 7 0 0 0-2 12 8 8 0 0 0 10 11M28 8a8 8 0 0 1 8 8v1a7 7 0 0 1 2 12 8 8 0 0 1-10 11M24 7v34" />
      <circle cx="17" cy="20" r="2" fill="currentColor" />
      <circle cx="31" cy="20" r="2" fill="currentColor" />
      <circle cx="17" cy="31" r="2" fill="currentColor" />
      <circle cx="31" cy="31" r="2" fill="currentColor" />
      <path {...common} d="M19 20h5M24 31h5" />
    </>
  ),
};

export function LectorMatIcon({ name, size = 24, title, ...props }: LectorMatIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {glyphs[name]}
    </svg>
  );
}

