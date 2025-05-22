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
import { Input } from '@/components/ui/input';

interface Additive {
  [key: string]: string;
}

async function getAdditives(): Promise<Additive[]> {
  const res = await fetch('https://ebrojevi-fast-api.onrender.com/database', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch additives: ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: Expected an array');
  }
  return data;
}

function AdditivesTable({ additives }: { additives: Additive[] }) {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredAdditives = additives.filter(
    (additive) =>
      additive.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      additive.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="search" className="mr-2">
          Pretraži po kodu ili nazivu:
        </label>
        <Input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pretraži po kodu ili nazivu"
          className="w-full md:w-1/2"
        />
      </div>
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              {additives.length > 0 &&
                Object.keys(additives[0]).map((key) => (
                  <TableHead key={key}>{key.toUpperCase()}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdditives.map((item, index) => (
              <TableRow
                key={item.code || index}
                className={`transition-all duration-200 ${getBackgroundColor(item.color || '')}`}
              >
                <TableCell>{index + 1}</TableCell>
                {Object.values(item).map((value, idx) => (
                  <TableCell key={idx}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default async function DatabasePage() {
  try {
    const data = await getAdditives();
    return (
      <div className="container mx-auto py-10 text-gray-800">
        <div className="flex flex-col gap-4">
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
          </div>
          <p className="text-muted-foreground">
            Prikaz svih E-brojeva aditiva s redovima označenim bojama.
          </p>
          <AdditivesTable additives={data} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-10 text-red-600">
        <h1>Error</h1>
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
      </div>
    );
  }
}