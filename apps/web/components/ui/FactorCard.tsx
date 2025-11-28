"use client";

import { ExternalLink, Info } from "lucide-react";
import { ScopeBadge } from "./ScopeBadge";
import { InfoTooltip } from "./InfoTooltip";
import { useState } from "react";

interface EmissionFactor {
  id: string;
  code: string;
  region: "PT" | "EU" | "UK";
  scope: "SCOPE1" | "SCOPE2" | "SCOPE3";
  source?: string;
  unit: string;
  co2ePerUnit: number;
  version?: string;
  description?: string;
  sourceUrl?: string;
}

interface FactorCardProps {
  factor: EmissionFactor;
  selected?: boolean;
  onSelect?: (factorId: string) => void;
  showDetails?: boolean;
  className?: string;
}

export function FactorCard({
  factor,
  selected = false,
  onSelect,
  showDetails = false,
  className = "",
}: FactorCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`card border-2 transition-all duration-200 ${
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 hover:border-emerald-300 cursor-pointer"
      } ${className}`}
      onClick={() => onSelect?.(factor.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-slate-900">{factor.code}</h4>
            <ScopeBadge scope={factor.scope} size="sm" />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              <strong>{factor.co2ePerUnit.toFixed(4)}</strong> kg CO₂e / {factor.unit}
            </span>
            {factor.version && (
              <span className="badge-muted">v{factor.version}</span>
            )}
          </div>
        </div>
        {factor.description && (
          <InfoTooltip
            content={factor.description}
            title={factor.code}
            icon="info"
            position="left"
          />
        )}
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">Região:</span>{" "}
              <span className="font-medium">{factor.region}</span>
            </div>
            {factor.source && (
              <div>
                <span className="text-slate-500">Fonte:</span>{" "}
                <span className="font-medium">{factor.source}</span>
              </div>
            )}
          </div>
          {factor.sourceUrl && (
            <a
              href={factor.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              Ver fonte <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {expanded && factor.description && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-sm text-slate-600">{factor.description}</p>
        </div>
      )}
    </div>
  );
}

