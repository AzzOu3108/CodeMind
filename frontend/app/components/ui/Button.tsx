"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "sm",
  className = "",
  ...props
}) => {
  const baseStyle =
    "bg-primary rounded-full text-white hover:bg-primary hover:opacity-90 transition-opacity duration-300 ease-in-out cursor-pointer";
    //  shadow-xl bg-primary font-bold rounded-full text-white hover:bg-primary hover:opacity-90 transition-opacity duration-300 ease-in-out cursor-pointer

  const sizeStyle: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-7 py-2",
    md: "px-6 py-4 2xl:px-7 2xl:py-5 2xl:text-xl",
    lg: "px-7 py-4 2xl:px-8 2xl:py-5 2xl:text-xl",
  };

  // You had `style={...}` but it should be `className={...}`
  const combined = `${baseStyle} ${sizeStyle[size]} ${className}`;

  return (
    <button {...props} className={combined}>
      {children}
    </button>
  );
};

export default Button;
