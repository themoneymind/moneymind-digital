import React from 'react';

interface BiometricIconProps extends React.HTMLAttributes<HTMLDivElement> {}

export const BiometricIcon: React.FC<BiometricIconProps> = ({ className, ...props }) => {
  return (
    <div className={className} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
        <path d="M12 7v10" />
        <path d="M12 7a3 3 0 0 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
    </div>
  );
};