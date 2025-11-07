"use client";
import React, {useEffect, useState} from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export function ResultsGraphs({projectId, from, to}:{projectId:string; from?:string; to?:string}){
  const [data,setData] = useState<any|null>(null);
  useEffect(()=>{
    const qs = new URLSearchParams(); if(from) qs.set('from',from); if(to) qs.set('to',to);
    fetch(`${API}/projects/${projectId}/results${qs.toString()?`?${qs}`:''}`).then(r=>r.json()).then(setData);
  },[projectId,from,to]);
  if(!data) return null;
  const scope = data.byScope as Record<string,number>;
  const max = Math.max(...Object.values(scope),1);
  const byType = data.byType as Record<string,number>;
  const byMonth = data.byMonth as Record<string,number>;
  return (
    <section className="mt-6 space-y-6">
      <div className="card">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="font-medium">Por Escopo</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-red-500"></span>SCOPE1</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-500"></span>SCOPE2</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-green-500"></span>SCOPE3</span>
          </div>
        </div>
        <svg width="400" height="150">
          {Object.entries(scope).map(([k,v],i)=>{
            const w = 80, gap=20, x=i*(w+gap), h = (v/max)*120; const y = 130-h;
            const color = k==='SCOPE1' ? '#ef4444' : k==='SCOPE2' ? '#3b82f6' : '#22c55e';
            return (
              <g key={k} transform={`translate(${x},0)`}>
                <title>{`${k}: ${v.toFixed(1)} kg CO2e`}</title>
                <rect x={0} y={y} width={w} height={h} fill={color} />
                <text x={w/2} y={145} textAnchor="middle" fontSize="10">{k}</text>
                <text x={w/2} y={y-4} textAnchor="middle" fontSize="10">{v.toFixed(1)}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="font-medium">Por Tipo</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-sky-500"></span>Tipos</span>
          </div>
        </div>
        <svg width="400" height="150">
          {Object.entries(byType).map(([k,v],i)=>{
            const w = 60, gap=10, x=i*(w+gap), h = (v/Math.max(...Object.values(byType),1))*120; const y = 130-h;
            return (
              <g key={k} transform={`translate(${x},0)`}>
                <title>{`${k}: ${v.toFixed(1)} kg CO2e`}</title>
                <rect x={0} y={y} width={w} height={h} fill="#0ea5e9" />
                <text x={w/2} y={145} textAnchor="middle" fontSize="9">{k}</text>
                <text x={w/2} y={y-4} textAnchor="middle" fontSize="9">{v.toFixed(1)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="card">
        <h3 className="font-medium mb-2">Série Temporal (YYYY‑MM)</h3>
        <svg width="480" height="160">
          {(() => {
            const entries = Object.entries(byMonth).sort(([a],[b])=>a.localeCompare(b));
            const maxM = Math.max(...entries.map(([,v])=>v),1);
            const points = entries.map(([,v],i)=>{
              const x = 20 + i*40; const y = 130 - (v/maxM)*120; return `${x},${y}`;
            }).join(' ');
            return (
              <g>
                <polyline fill="none" stroke="#16a34a" strokeWidth="2" points={points} />
                {entries.map(([k,v],i)=>{
                  const x = 20 + i*40; const y = 130 - (v/maxM)*120;
                  return <text key={k} x={x} y={145} textAnchor="middle" fontSize="9">{k}</text>;
                })}
              </g>
            );
          })()}
        </svg>
      </div>
    </section>
  );
}
