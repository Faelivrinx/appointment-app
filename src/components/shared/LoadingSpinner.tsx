"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "accent-200",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-transparent border-2 border-${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
