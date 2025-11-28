"use client";

import { Info } from "lucide-react";
import { useState } from "react";

type Scope = "SCOPE1" | "SCOPE2" | "SCOPE3";

interface ScopeBadgeProps {
  scope: Scope;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const scopeConfig = {
  SCOPE1: {
    label: "Escopo 1",
    description: "Emissões diretas de fontes próprias ou controladas",
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    icon: "🔴",
  },
  SCOPE2: {
    label: "Escopo 2",
    description: "Emissões indiretas da geração de energia adquirida",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: "🔵",
  },
  SCOPE3: {
    label: "Escopo 3",
    description: "Outras emissões indiretas na cadeia de valor",
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: "🟢",
  },
};

export function ScopeBadge({ scope, showIcon = false, size = "md", className = "" }: ScopeBadgeProps) {
  const config = scopeConfig[scope];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} ${config.border} border rounded-full font-medium ${sizeClasses[size]} ${className}`}
      title={config.description}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

