import 'server-only';
import {NextResponse} from 'next/server';

export async function GET() {
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${api}/`, {cache: 'no-store'});
    const text = await res.text();
    return new NextResponse(text, {status: res.ok ? 200 : 500});
  } catch (e) {
    return NextResponse.json({error: 'API unreachable'}, {status: 502});
  }
}
