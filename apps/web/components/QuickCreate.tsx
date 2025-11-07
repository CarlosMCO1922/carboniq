"use client";
import {useEffect, useState} from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Project = {id:string; region:'PT'|'EU'|'UK'};

export function QuickCreate({projectId}:{projectId:string}){
  const [busy,setBusy] = useState(false);
  const [project,setProject] = useState<Project|undefined>();

  useEffect(()=>{ fetch(`${API}/projects/${projectId}`).then(r=>r.json()).then(setProject); },[projectId]);

  async function create(type:string, amount:number, unit:string){
    if(!project) return;
    setBusy(true);
    // Sugere fator por região/tipo e cria atividade com factorId para auto-cálculo
    let factorId: string | undefined = undefined;
    try{
      const f = await fetch(`${API}/factors/suggest?region=${project.region}&type=${encodeURIComponent(type)}`).then(r=>r.json());
      factorId = f?.id || undefined;
    }catch{}
    await fetch(`${API}/activities`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId,type,amount,unit,factorId})});
    setBusy(false);
    location.reload();
  }
  return (
    <section className="mt-6 p-4 bg-slate-50 rounded-lg">
      <h3 className="text-sm font-medium text-slate-700 mb-3">🚀 Criação rápida</h3>
      <div className="flex flex-wrap gap-2">
        <button disabled={busy} className="btn-primary text-sm" onClick={()=>create('electricity',100,'kWh')}>⚡ Eletricidade 100 kWh</button>
        <button disabled={busy} className="btn-secondary text-sm" onClick={()=>create('diesel',10,'L')}>🛢️ Diesel 10 L</button>
        <button disabled={busy} className="btn-secondary text-sm" onClick={()=>create('gasoline',10,'L')}>⛽ Gasolina 10 L</button>
        <button disabled={busy} className="btn-secondary text-sm" onClick={()=>create('natgas',50,'Sm3')}>🔥 Gás Natural 50 Sm³</button>
        <button disabled={busy} className="btn-secondary text-sm" onClick={()=>create('transport_km',50,'km')}>🚗 Transporte 50 km</button>
      </div>
    </section>
  );
}
