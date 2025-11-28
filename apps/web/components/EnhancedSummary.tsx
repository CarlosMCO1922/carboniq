"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./ui/MetricCard";
import { TrendingUp, Activity, Zap, Factory } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function EnhancedSummary({
  projectId,
  from,
  to,
}: {
  projectId: string;
  from?: string;
  to?: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    fetch(`${API}/projects/${projectId}/summary${qs.toString() ? `?${qs.toString()}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId, from, to]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const s = data.totals.byScope as { SCOPE1: number; SCOPE2: number; SCOPE3: number };
  const total = data.totals.co2e as number;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total CO₂e"
        value={total}
        unit="kg"
        icon={Activity}
        color="primary"
        size="lg"
      />
      <MetricCard
        title="Escopo 1"
        value={s.SCOPE1}
        unit="kg"
        icon={Factory}
        color="scope1"
      />
      <MetricCard
        title="Escopo 2"
        value={s.SCOPE2}
        unit="kg"
        icon={Zap}
        color="scope2"
      />
      <MetricCard
        title="Escopo 3"
        value={s.SCOPE3}
        unit="kg"
        color="scope3"
      />
    </div>
  );
}

