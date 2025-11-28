"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: LucideIcon;
  color?: "primary" | "scope1" | "scope2" | "scope3" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorConfig = {
  primary: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
  },
  scope1: {
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-600",
    value: "text-red-700",
  },
  scope2: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    value: "text-blue-700",
  },
  scope3: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    value: "text-green-700",
  },
  neutral: {
    bg: "bg-slate-50",
    icon: "bg-slate-100 text-slate-600",
    value: "text-slate-700",
  },
};

const sizeConfig = {
  sm: {
    value: "text-2xl",
    title: "text-xs",
    icon: "w-8 h-8",
  },
  md: {
    value: "text-3xl",
    title: "text-sm",
    icon: "w-10 h-10",
  },
  lg: {
    value: "text-4xl",
    title: "text-base",
    icon: "w-12 h-12",
  },
};

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  color = "neutral",
  size = "md",
  className = "",
}: MetricCardProps) {
  const config = colorConfig[color];
  const sizeStyles = sizeConfig[size];

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString("pt-PT", { maximumFractionDigits: 2 });
    }
    return val;
  };

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColor =
    trend && TrendIcon
      ? trend.value > 0
        ? "text-red-600"
        : trend.value < 0
        ? "text-emerald-600"
        : "text-slate-600"
      : "";

  return (
    <div className={`card ${config.bg} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${sizeStyles.title} font-medium text-slate-600 mb-2`}>{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`${sizeStyles.value} font-bold ${config.value}`}>
              {formatValue(value)}
            </span>
            {unit && (
              <span className={`${sizeStyles.title} ${config.value} font-medium`}>{unit}</span>
            )}
          </div>
          {trend && TrendIcon && (
            <div className={`flex items-center gap-1 mt-2 ${sizeStyles.title} ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span>
                {Math.abs(trend.value).toFixed(1)}% {trend.label || "vs período anterior"}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${config.icon} ${sizeStyles.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

