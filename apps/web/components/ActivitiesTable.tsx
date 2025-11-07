"use client";
import {useEffect, useMemo, useState} from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Activity = {id:string; type:string; amount:number; unit:string; factorId?:string; factor?: {code:string; scope:'SCOPE1'|'SCOPE2'|'SCOPE3'}};

type Props = {projectId:string};

export function ActivitiesTable({projectId}:Props){
  const [list,setList] = useState<Activity[]>([]);
  const [filterScope,setFilterScope] = useState<string>('');
  const [filterType,setFilterType] = useState<string>('');
  const [selected,setSelected] = useState<Record<string,boolean>>({});

  async function load(){
    const res = await fetch(`${API}/activities?projectId=${projectId}`,{cache:'no-store'});
    const data = await res.json();
    setList(data);
  }
  useEffect(()=>{ load(); },[projectId]);

  const filtered = useMemo(()=> list.filter(a=>{
    const byType = filterType ? a.type.toLowerCase().includes(filterType.toLowerCase()) : true;
    const byScope = filterScope ? (a.factor?.scope === filterScope) : true;
    return byType && byScope;
  }),[list, filterType, filterScope]);

  function toggle(id:string){ setSelected(prev=>({...prev,[id]:!prev[id]})); }

  async function calculateSelected(){
    const ids = Object.keys(selected).filter(k=>selected[k]);
    if(ids.length===0) return;
    await fetch(`${API}/projects/${projectId}/calculate-bulk`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({activityIds:ids})});
    await load();
    location.reload();
  }

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 text-sm mb-2">
        <input className="border px-2 py-1 rounded" placeholder="filtrar tipo" value={filterType} onChange={e=>setFilterType(e.target.value)} />
        <select className="border px-2 py-1 rounded" value={filterScope} onChange={e=>setFilterScope(e.target.value)}>
          <option value="">Todos escopos</option>
          <option value="SCOPE1">Escopo 1</option>
          <option value="SCOPE2">Escopo 2</option>
          <option value="SCOPE3">Escopo 3</option>
        </select>
        <button onClick={calculateSelected} className="btn-primary">🧮 Calcular selecionadas</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Sel</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Unidade</th>
              <th>Fator</th>
              <th>Escopo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a=> (
              <tr key={a.id} className="border-b">
                <td className="py-2"><input type="checkbox" checked={!!selected[a.id]} onChange={()=>toggle(a.id)} /></td>
                <td>{a.type}</td>
                <td>{a.amount}</td>
                <td>{a.unit}</td>
                <td>{a.factor?.code ?? a.factorId ?? '-'}</td>
                <td>{a.factor?.scope ?? '-'}</td>
                <td className="space-x-2">
                  <button className="btn-secondary text-xs" onClick={async()=>{await fetch(`${API}/activities/${a.id}/duplicate`,{method:'POST'}); await load();}}>📋 Duplicar</button>
                  <button className="btn-accent text-xs" onClick={async()=>{
                    const dup = await fetch(`${API}/activities/${a.id}/duplicate`,{method:'POST'}).then(r=>r.json()).catch(()=>null);
                    if(dup?.id){
                      const locale = (typeof window!== 'undefined' ? window.location.pathname.split('/')[1] : 'pt');
                      window.location.href = `/${locale}/projects/${projectId}/activities/${dup.id}/edit`;
                    }
                  }}>✏️ Duplicar e editar</button>
                  <button className="btn-danger text-xs" onClick={async()=>{
                    if(!confirm('Eliminar esta atividade?')) return;
                    await fetch(`${API}/activities/${a.id}`,{method:'DELETE'});
                    await load();
                  }}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
