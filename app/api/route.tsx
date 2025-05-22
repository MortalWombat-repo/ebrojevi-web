// app/api/additives/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://ebrojevi-fast-api.onrender.com/database', {
      cache: 'no-store', // Prevents caching to ensure fresh data
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch additives: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data from the API' }, { status: 500 });
  }
}