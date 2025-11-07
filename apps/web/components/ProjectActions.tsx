"use client";

export function ProjectActions({projectId}:{projectId:string}){
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  async function computeSpend(){
    await fetch(`${api}/spend/compute`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({projectId})
    });
    location.reload();
  }
  return (
    <div className="mt-6 flex items-center gap-4">
      <button onClick={computeSpend} className="btn-accent">💰 Compute Spend</button>
    </div>
  );
}
