"use client";

import { HelpCircle, Info } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  content: string;
  title?: string;
  icon?: "info" | "help";
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function InfoTooltip({
  content,
  title,
  icon = "info",
  position = "top",
  className = "",
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const IconComponent = icon === "info" ? Info : HelpCircle;

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Mais informações"
      >
        <IconComponent className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-64 p-3 bg-slate-900 text-white text-sm rounded-lg shadow-lg ${positionClasses[position]} animate-fade-in`}
          role="tooltip"
        >
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-slate-200">{content}</div>
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
              position === "top" ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2" :
              position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2" :
              position === "left" ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2" :
              "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
}

