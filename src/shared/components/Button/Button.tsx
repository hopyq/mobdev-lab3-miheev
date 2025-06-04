import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  const baseStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#646cff',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
  };

  return (
    <button
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...(props.disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
      }}
      {...props}
    >
      {children}
    </button>
  );
};