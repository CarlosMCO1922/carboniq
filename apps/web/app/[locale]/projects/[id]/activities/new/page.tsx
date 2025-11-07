"use client";
import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Factor = {id: string; code: string; scope: 'SCOPE1'|'SCOPE2'|'SCOPE3'; region: 'PT'|'EU'|'UK'; unit: string; co2ePerUnit?: number};

type Project = {id:string; region:'PT'|'EU'|'UK'};

export default function NewActivityPage(){
  const params = useParams();
  const projectId = String(params?.id || '');
  const locale = String(params?.locale || 'pt');

  const [project,setProject] = useState<Project|undefined>();
  const [type,setType] = useState('electricity');
  const [amount,setAmount] = useState<number>(0);
  const [unit,setUnit] = useState('kWh');
  const [factors,setFactors] = useState<Factor[]>([]);
  const [factorId,setFactorId] = useState<string>('');
  const [error,setError] = useState<string|undefined>();
  const [q,setQ] = useState('');
  const [suggestions,setSuggestions] = useState<Factor[]>([]);
  const [unitFilter,setUnitFilter] = useState('');
  const [scopeOverride,setScopeOverride] = useState<'SCOPE1'|'SCOPE2'|'SCOPE3'|''>('');
  const [rfMultiplier,setRfMultiplier] = useState<number|''>('');
  const [s3cat,setS3cat] = useState<string>('');
  const [favorites,setFavorites] = useState<any[]>([]);

  useEffect(()=>{
    fetch(`${API}/projects/${projectId}`).then(r=>r.json()).then((p)=>{
      setProject(p);
      try{ const fav = JSON.parse(localStorage.getItem(`fav:${projectId}`)||'[]'); setFavorites(fav); }catch{}
    });
  },[projectId]);

  useEffect(()=>{
    if(!project) return;

    let computedScope: 'SCOPE1'|'SCOPE2'|'SCOPE3'|undefined;
    if(type==='electricity'){ computedScope='SCOPE2'; setUnit('kWh'); }
    else if(type==='diesel'){ computedScope='SCOPE1'; setUnit('L'); }
    else if(type==='gasoline'){ computedScope='SCOPE1'; setUnit('L'); }
    else if(type==='natgas'){ computedScope='SCOPE1'; setUnit('Sm3'); }
    else if(type==='transport_km'){ computedScope='SCOPE3'; setUnit('km'); }

    const fetchList = async ()=>{
      const params = new URLSearchParams();
      params.set('region', project.region);
      const effScope = scopeOverride || computedScope || 'SCOPE2';
      params.set('scope', effScope);
      if(unitFilter) params.set('unit', unitFilter);
      params.set('limit','200');
      const res = await fetch(`${API}/factors/search?${params.toString()}`,{cache:'no-store'}).then(r=>r.json()).catch(()=>[]);
      return Array.isArray(res)?res:[];
    };

    (async ()=>{
      const list = await fetchList();
      setFactors(list);
    })();

    fetch(`${API}/factors/suggest?region=${project.region}&type=${encodeURIComponent(type)}`,{cache:'no-store'})
      .then(r=>r.json()).then((f)=>{ if (f?.id) { setFactorId(f.id); if (f.unit) setUnit(f.unit); } });
  },[project, type, scopeOverride, unitFilter]);

  // Autocomplete de fatores via /factors/search
  useEffect(()=>{
    const ctrl = new AbortController();
    (async()=>{
      if(!project) return;
      const params = new URLSearchParams();
      if(q) params.set('q', q);
      if(s3cat) params.set('q', `S3_${s3cat}`);
      params.set('region', project.region);
      const autoScope = type==='electricity' ? 'SCOPE2' : (type==='transport_km' ? 'SCOPE3' : 'SCOPE1');
      params.set('scope', scopeOverride || autoScope);
      if(unitFilter) params.set('unit', unitFilter);
      params.set('limit','100');
      const res = await fetch(`${API}/factors/search?${params.toString()}`,{signal: ctrl.signal}).then(r=>r.json()).catch(()=>[]);
      setSuggestions(Array.isArray(res)?res:[]);
    })();
    return ()=> ctrl.abort();
  },[q, s3cat, project, type, scopeOverride, unitFilter]);

  const selectedFactor = useMemo(()=> factors.find(f=>f.id===factorId),[factors,factorId]);
  const preview = useMemo(()=> {
    if(!selectedFactor) return undefined;
    const per = (selectedFactor as any).co2ePerUnit ?? 0;
    const rf = (rfMultiplier && String(selectedFactor.code).startsWith('FLIGHT_')) ? Number(rfMultiplier) : 1;
    return amount ? amount * per * rf : undefined;
  },[selectedFactor, amount, rfMultiplier]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setError(undefined);
    try{
      const metadata: any = {};
      if(rfMultiplier) metadata.rfMultiplier = Number(rfMultiplier);
      const res = await fetch(`${API}/activities`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ projectId, type, amount, unit, factorId: factorId || undefined, metadata })
      });
      if(!res.ok){ const txt = await res.text(); throw new Error(txt||`HTTP ${res.status}`); }
      window.location.href = `/${locale}/projects/${projectId}`;
    }catch(err:any){ setError(String(err.message||err)); }
  }

  // Quando escolho da lista de sugestões, garanto que aparece na dropdown principal
  function chooseSuggestion(s: any){
    setFactorId(s.id); if(s.unit) setUnit(s.unit); setQ('');
    setFactors(prev => prev.find(p=>p.id===s.id) ? prev : [...prev, s]);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Nova atividade</h1>

      <div className="flex gap-2 text-sm">
        <button type="button" className={`px-2 py-1 border rounded ${type==='electricity'?'bg-black text-white':''}`} onClick={()=>setType('electricity')}>Eletricidade</button>
        <button type="button" className={`px-2 py-1 border rounded ${type==='diesel'?'bg-black text-white':''}`} onClick={()=>setType('diesel')}>Diesel</button>
        <button type="button" className={`px-2 py-1 border rounded ${type==='gasoline'?'bg-black text-white':''}`} onClick={()=>setType('gasoline')}>Gasolina</button>
        <button type="button" className={`px-2 py-1 border rounded ${type==='natgas'?'bg-black text-white':''}`} onClick={()=>setType('natgas')}>Gás Natural</button>
        <button type="button" className={`px-2 py-1 border rounded ${type==='transport_km'?'bg-black text-white':''}`} onClick={()=>setType('transport_km')}>Transporte (km)</button>
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <select value={s3cat} onChange={e=>setS3cat(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">S3 Categoria (preset)</option>
          {Array.from({length:15},(_,i)=>i+1).map(n=> (
            <option key={n} value={`CAT${String(n).padStart(2,'0')}_`}>{`Cat.${n}`}</option>
          ))}
        </select>
        <select value={String(rfMultiplier)} onChange={e=>setRfMultiplier(e.target.value?Number(e.target.value):'')} className="border px-2 py-1 rounded">
          <option value="">RF (voos) — nenhum</option>
          <option value="1.7">RF 1.7</option>
          <option value="1.9">RF 1.9</option>
          <option value="2.0">RF 2.0</option>
        </select>
        <button type="button" className="border px-2 py-1 rounded" disabled={!selectedFactor} onClick={()=>{
          if(!selectedFactor) return; const key = `fav:${projectId}`;
          const current = JSON.parse(localStorage.getItem(key)||'[]');
          const exists = current.find((x:any)=>x.id===selectedFactor.id);
          if(!exists){ current.push({id:selectedFactor.id, code:selectedFactor.code, scope:selectedFactor.scope, unit:selectedFactor.unit}); localStorage.setItem(key, JSON.stringify(current)); setFavorites(current); }
        }}>⭐ Guardar fator</button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm">Tipo</label>
          <input name="type" value={type} onChange={e=>setType(e.target.value)} className="border px-2 py-1 rounded w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Quantidade</label>
            <input name="amount" type="number" step="any" value={amount} onChange={e=>setAmount(Number(e.target.value))} required className="border px-2 py-1 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Unidade</label>
            <input name="unit" value={unit} onChange={e=>setUnit(e.target.value)} required className="border px-2 py-1 rounded w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm">Fator (opcional)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input placeholder="Pesquisar fator..." value={q} onChange={e=>setQ(e.target.value)} className="border px-2 py-1 rounded w-full" />
            <input placeholder="Filtrar unidade (ex: kWh, km, L)" value={unitFilter} onChange={e=>setUnitFilter(e.target.value)} className="border px-2 py-1 rounded w-full" />
            <select value={scopeOverride} onChange={e=>setScopeOverride(e.target.value as any)} className="border px-2 py-1 rounded w-full">
              <option value="">Escopo (auto)</option>
              <option value="SCOPE1">SCOPE1</option>
              <option value="SCOPE2">SCOPE2</option>
              <option value="SCOPE3">SCOPE3</option>
            </select>
          </div>
          { (q || s3cat) && suggestions.length>0 && (
            <div className="max-h-48 overflow-auto border rounded mb-2 text-xs">
              <ul>
                {suggestions.map((s:any)=> (
                  <li key={s.id} className="px-2 py-1 hover:bg-slate-50 cursor-pointer flex items-center justify-between" onClick={()=>chooseSuggestion(s)}>
                    <span>{s.code}</span>
                    <span className="text-slate-500">{s.scope} · {s.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-xs text-slate-600 mb-1">{factors.length} fatores disponíveis</div>
          <select name="factorId" value={factorId} onChange={e=>setFactorId(e.target.value)} className="border px-2 py-1 rounded w-full">
            <option value="">Nenhum</option>
            {factors.map(f=> (
              <option key={f.id} value={f.id}>{f.code} ({f.scope})</option>
            ))}
          </select>
          {selectedFactor && typeof preview==='number' && (
            <p className="text-xs text-gray-600 mt-1">Pré-visualização: {preview.toFixed(2)} kg CO2e</p>
          )}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <button className="btn-primary">💾 Guardar Atividade</button>
      </form>
    </main>
  )
}
          <select name="factorId" value={factorId} onChange={e=>setFactorId(e.target.value)} className="border px-2 py-1 rounded w-full">
            <option value="">Nenhum</option>
            {factors.map(f=> (
              <option key={f.id} value={f.id}>{f.code} ({f.scope})</option>
            ))}
          </select>
          {selectedFactor && typeof preview==='number' && (
            <p className="text-xs text-gray-600 mt-1">Pré-visualização: {preview.toFixed(2)} kg CO2e</p>
          )}
        </div>
        {favorites.length>0 && (
          <div className="mt-2 text-xs">
            <div className="mb-1 text-slate-600">Favoritos:</div>
            <div className="flex flex-wrap gap-2">
              {favorites.map((f:any)=> (
                <button type="button" key={f.id} className="btn-secondary text-xs" onClick={()=>{setFactorId(f.id); setUnit(f.unit);}}>{f.code}</button>
              ))}
            </div>
        </div>
        {favorites.length>0 && (
          <div className="mt-2 text-xs">
            <div className="mb-1 text-slate-600">Favoritos:</div>
            <div className="flex flex-wrap gap-2">
              {favorites.map((f:any)=> (
                <button type="button" key={f.id} className="btn-secondary text-xs" onClick={()=>{setFactorId(f.id); setUnit(f.unit);}}>{f.code}</button>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <button className="btn-primary">💾 Guardar Atividade</button>
      </form>
      </form>
    </main>
  )
}
