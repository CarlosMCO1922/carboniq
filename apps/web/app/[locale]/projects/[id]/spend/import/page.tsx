"use client";
import {useState} from 'react';
import {useParams} from 'next/navigation';

export default function SpendImportPage(){
  const params = useParams();
  const [text,setText] = useState("date,amount,currency,category\n2024-01-01,120,EUR,OFFICE\n2024-02-01,300,EUR,TRAVEL\n");
  const [msg,setMsg] = useState<string|undefined>();
  const [preview,setPreview] = useState<string[][]>([['date','amount','currency','category'],['2024-01-01','120','EUR','OFFICE']]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    f.text().then(t=>{
      setText(t);
      const rows = t.trim().split(/\r?\n/).slice(0,6).map(l=>l.split(','));
      setPreview(rows);
    });
  }

  async function onImport(){
    const res = await fetch(`/${params?.locale}/projects/${params?.id}/spend/import/ingest`,{
      method:'POST',
      body: text
    });
    const data = await res.json();
    setMsg(`Importadas ${data.count ?? 0} despesas`);
  }

  async function onImportAndCompute(){
    setMsg(undefined);
    await onImport();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/spend/compute`,{
      method:'POST', headers:{'Content-Type':'application/json'},body: JSON.stringify({projectId: String(params?.id)})
    });
    const j = await res.json().catch(()=>({}));
    setMsg((prev)=> `${prev ?? ''} — Calculadas (spend): ${j.created ?? 0}`);
  }

  return (
    <main className="py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Importação CSV (Despesas)</h1>
        <div className="card">
          <p className="text-sm text-slate-600 mb-3">Cabeçalhos: date, amount, currency, category</p>
          <div className="flex items-center gap-3 mb-3">
            <input type="file" accept=".csv" onChange={onFile} className="text-sm" />
            <button onClick={onImport} className="btn-secondary">Importar</button>
            <button onClick={onImportAndCompute} className="btn-primary">Importar e calcular</button>
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 border rounded-lg p-2 font-mono text-sm" />
          <div className="mt-4">
            <h3 className="font-medium mb-2">Pré-visualização</h3>
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <tbody>
                  {preview.map((row,i)=> (
                    <tr key={i} className="border-b">
                      {row.map((c,j)=> (<td key={j} className="py-1 px-2">{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {msg && <p className="text-sm mt-3">{msg}</p>}
        </div>
      </div>
    </main>
  );
}
