import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out
        bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};
