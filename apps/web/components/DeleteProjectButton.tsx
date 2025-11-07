"use client";
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export function DeleteProjectButton({projectId}:{projectId:string}){
  async function onDelete(){
    if(!confirm('Eliminar este projeto? Todas as atividades/cálculos/despesas serão removidos.')) return;
    await fetch(`${API}/projects/${projectId}`,{method:'DELETE'});
    location.href = `/${(typeof window!== 'undefined' ? window.location.pathname.split('/')[1] : 'pt')}/projects`;
  }
  return <button className="btn-danger" onClick={onDelete}>🗑️ Eliminar Projeto</button>;
}
