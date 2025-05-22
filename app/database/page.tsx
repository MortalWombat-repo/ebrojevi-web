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

function Page() {
  const [data, setData] = useState<Additive[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://ebrojevi-fast-api.onrender.com/database',
        {
          cache: 'no-store',
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch additives: ${res.status}`);
      }
      const data = await res.json();
      setData(data);
    }
    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const getBackgroundColor = (color: string) => {
    switch (color.toLowerCase()) {
      case 'green':
        return 'bg-[#C1E1C1] hover:bg-[#4ADE80] hover:shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]';
      case 'yellow':
        return 'bg-[#FFFAA0] hover:bg-[#FACC15] hover:shadow-[0_0_8px_2px_rgba(250,204,21,0.6)]';
      case 'red':
        return 'bg-[#FAA0A0] hover:bg-[#F87171] hover:shadow-[0_0_8px_2px_rgba(248,113,113,0.6)]';
      default:
        return 'bg-white hover:bg-gray-100 hover:shadow-[0_0_8px_2px_rgba(209,213,219,0.6)]';
    }
  };

  return (
    <div className="container mx-auto py-10 text-gray-800">
      <div className="flex flex-col gap-4">
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
        </div>
        <p className="text-muted-foreground">
          Displaying all E-number additives with color-coded rows.
        </p>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                {Object.keys(data[0]).map((key) => (
                  <TableHead key={key}>{key.toUpperCase()}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <React.Fragment key={item.code || index}>
                  <TableRow
                    className={`transition-all duration-200 ${getBackgroundColor(item.color || '')}`}
                    onClick={() => {
                      const newExpanded = new Set(expanded);
                      if (newExpanded.has(index)) {
                        newExpanded.delete(index);
                      } else {
                        newExpanded.add(index);
                      }
                      setExpanded(newExpanded);
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {Object.entries(item).map(([key, value]) => (
                      <TableCell key={key}>
                        {key === 'description' ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : value}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expanded.has(index) && (
                    <TableRow>
                      <TableCell colSpan={1 + Object.keys(item).length}>
                        Full Description: {item.description}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default page;