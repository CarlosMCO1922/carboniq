"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ScopeBadge } from "./ui/ScopeBadge";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const SCOPE_COLORS = {
  SCOPE1: "#ef4444",
  SCOPE2: "#3b82f6",
  SCOPE3: "#22c55e",
};

export function EnhancedResultsGraphs({
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
    fetch(`${API}/projects/${projectId}/results${qs.toString() ? `?${qs.toString()}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId, from, to]);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const scope = data.byScope as Record<string, number>;
  const byType = data.byType as Record<string, number>;
  const byMonth = data.byMonth as Record<string, number>;

  // Prepare data for charts
  const scopeData = Object.entries(scope).map(([name, value]) => ({
    name: name.replace("SCOPE", "Escopo "),
    value: Number(value),
    scope: name,
  }));

  const typeData = Object.entries(byType)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      value: Number(value),
      fullName: name,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10

  const monthData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({
      month,
      value: Number(value),
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{payload[0].name || payload[0].payload.name}</p>
          <p className="text-sm text-slate-600">
            {payload[0].value.toLocaleString("pt-PT", { maximumFractionDigits: 2 })} kg CO₂e
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Por Escopo - Pie Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Distribuição por Escopo</h3>
          <div className="flex items-center gap-3 text-xs">
            {Object.entries(SCOPE_COLORS).map(([scope, color]) => (
              <div key={scope} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-slate-600">{scope.replace("SCOPE", "Escopo ")}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={scopeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {scopeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SCOPE_COLORS[entry.scope as keyof typeof SCOPE_COLORS]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {scopeData.map((item) => (
            <div key={item.scope} className="text-center">
              <ScopeBadge scope={item.scope as any} size="sm" className="mb-2" />
              <div className="text-lg font-semibold text-slate-900">
                {item.value.toLocaleString("pt-PT", { maximumFractionDigits: 2 })} kg
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Por Tipo - Bar Chart */}
      {typeData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Tipos de Atividade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" width={120} stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Série Temporal - Line Chart */}
      {monthData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Evolução Temporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

