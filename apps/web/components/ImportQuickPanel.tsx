"use client";
import {useState} from 'react';

export function ImportQuickPanel({locale, projectId}:{locale:string; projectId:string}){
  const [text,setText] = useState("date,amount,currency,category\n2024-01-01,120,EUR,OFFICE\n");
  const [msg,setMsg] = useState<string|undefined>();
  async function importAndCompute(){
    setMsg(undefined);
    await fetch(`/${locale}/projects/${projectId}/spend/import/ingest`,{ method:'POST', body:text });
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const res = await fetch(`${api}/spend/compute`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({projectId}) });
    const j = await res.json().catch(()=>({}));
    setMsg(`Calculadas (spend): ${j.created ?? 0}`);
  }
  return (
    <section className="mt-6 card">
      <h3 className="font-medium text-sm mb-2">Importar CSV rápido (Spend)</h3>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-28 border rounded-lg p-2 font-mono text-xs" />
      <div className="mt-3"><button onClick={importAndCompute} className="btn-accent">📥 Importar e calcular</button></div>
      {msg && <p className="text-xs mt-2 text-slate-600">{msg}</p>}
    </section>
  );
}
