// app/api/additives/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://ebrojevi-fast-api.onrender.com/database', { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed: ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Network error fetching additives' },
      { status: 502 }
    );
  }
}


// app/database/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Additive {
  [key: string]: string;
}

export default function DatabasePage() {
  const [data, setData] = useState<Additive[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdditives() {
      try {
        const res = await fetch('/api/additives');
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
          let errMsg = `Request failed: ${res.status}`;
          if (contentType.includes('application/json')) {
            const errJson = await res.json();
            errMsg = errJson.error || errMsg;
          }
          throw new Error(errMsg);
        }
        let json: Additive[];
        if (contentType.includes('application/json')) {
          json = await res.json();
        } else {
          const text = await res.text();
          throw new Error('Invalid JSON response');
        }
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdditives();
  }, []);

  const getBackgroundColor = (color: string) => {
    switch (color.toLowerCase()) {
      case 'green':
        return 'bg-[#C1E1C1]';
      case 'yellow':
        return 'bg-[#FFFAA0]';
      case 'red':
        return 'bg-[#FAA0A0]';
      default:
        return '';
    }
  };

  const truncate = (text: string) =>
    text.length > 20 ? `${text.slice(0, 20)}...` : text;

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Additives List</h1>
        <p className="text-muted-foreground">
          Displaying all E-number additives with color-coded rows.
        </p>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-800">#</TableHead>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <TableHead key={key} className="text-gray-800">
                      {key.toUpperCase()}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.code || index}
                  className={`${getBackgroundColor(item.color || '')} cursor-pointer`}
                  onClick={() =>
                    setExpandedIndex(index === expandedIndex ? null : index)
                  }
                >
                  <TableCell className="text-gray-800">{index + 1}</TableCell>
                  {Object.entries(item).map(([key, value], idx) => (
                    <TableCell key={idx} className="text-gray-800">
                      {key === 'description'
                        ? expandedIndex === index
                          ? value
                          : truncate(value)
                        : value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}