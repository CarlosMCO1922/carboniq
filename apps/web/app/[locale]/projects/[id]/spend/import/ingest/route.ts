import {NextResponse} from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request, {params}: {params: {id: string; locale: string}}) {
  const text = await req.text();
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  const res = await fetch(`${api}/spend/import.csv?projectId=${params.id}`, {
    method: 'POST',
    headers: {'Content-Type': 'text/csv'},
    body: text
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, {status: res.status});
}
