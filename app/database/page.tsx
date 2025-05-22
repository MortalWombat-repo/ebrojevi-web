'use client';

// app/database/page.tsx
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
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Request failed: ${res.status}`);
        }
        const json: Additive[] = await res.json();
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