'use client';

import React, { useState } from 'react';
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

async function getAdditives(): Promise<Additive[]> {
  const res = await fetch('https://ebrojevi-fast-api.onrender.com/database', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch additives: ${res.status}`);
  return res.json();
}

export default function DatabasePage() {
  const [data, setData] = useState<Additive[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // New error state

  React.useEffect(() => {
    getAdditives()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.message); // Set error message for display
      });
  }, []);

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

  // Render error message if fetch fails
  if (error) {
    return (
      <div className="container mx-auto py-10 text-gray-800">
        <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
        <p className="text-red-600 mt-4">Error: {error}</p>
      </div>
    );
  }

  // Render loading state if no data yet
  if (data.length === 0) {
    return (
      <div className="container mx-auto py-10 text-gray-800">
        <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

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
                {data[0] &&
                  Object.keys(data[0]).map((key) => (
                    <TableHead key={key}>{key.toUpperCase()}</TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const isExpanded = expandedRow === index;
                return (
                  <TableRow
                    key={item.code || index}
                    className={`transition-all duration-200 ${getBackgroundColor(
                      item.color || ''
                    )} cursor-pointer`}
                    onClick={() => setExpandedRow(isExpanded ? null : index)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    {Object.keys(item).map((key) => {
                      const value = item[key];
                      const isDescription = key === 'description';
                      const truncated =
                        value.length > 20 ? `${value.slice(0, 20)}...` : value;

                      return (
                        <TableCell key={key}>
                          {isDescription ? (
                            <span className="whitespace-nowrap">
                              {isExpanded ? value : truncated}
                            </span>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}