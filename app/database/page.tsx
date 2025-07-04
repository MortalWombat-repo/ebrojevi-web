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
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';

interface Additive {
  [key: string]: string;
}

function DatabasePage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Additive[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('eNumbers') || '');

  useEffect(() => {
    async function getAdditives() {
      try {
        const res = await fetch('/api', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch additives: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    getAdditives();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (data.length === 0 && !error) {
    return <div className="text-center">Loading...</div>;
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

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpanded(newExpanded);
  };

  const filteredData = data.filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(/[,;]\s*/);
    return searchTerms.some(term => 
      item.code?.toLowerCase().includes(term) ||
      item.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mx-auto py-10 text-gray-800 max-w-7xl">
      <div className="flex flex-col gap-4 items-center">
        <div className="mt-8 flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">
            Popis Ebrojeva
          </h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Prikaz svih Ebrojeva označenih bojama po štetnosti. Upišite E-brojeve odvojene zarezom ili točka-zarezom za pretragu više brojeva odjednom.
        </p>
        <div className="w-full max-w-md mb-4">
          <Input
            type="text"
            placeholder="Pretraži po kodu ili nazivu (npr: E100, E200; E300)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-gray-100"
          />
        </div>
        <div className="rounded-md border overflow-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="text-center">KOD/CODE</TableHead>
                <TableHead className="text-center">NAZIV/NAME</TableHead>
                <TableHead className="text-center">OPIS/DESCRIPTION</TableHead>
                <TableHead className="text-center">TIP/TYPE</TableHead>
                <TableHead className="text-center">PDU/ADI</TableHead>
                <TableHead className="text-center">SIGURNOST/COLOR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <React.Fragment key={item.code || index}>
                  <TableRow
                    className={`transition-all duration-200 cursor-pointer ${getBackgroundColor(
                      item.color || ''
                    )}`}
                    onClick={() => toggleExpand(index)}
                  >
                    <TableCell className="align-middle text-center">
                      {index + 1}
                    </TableCell>
                    {['code', 'name', 'description', 'type', 'adi', 'color'].map((key) => (
                      <TableCell
                        key={key}
                        className={`align-middle ${
                          key === 'name'
                            ? 'whitespace-normal break-words text-center px-2 py-1'
                            : key === 'description'
                            ? 'whitespace-nowrap overflow-hidden text-overflow-ellipsis text-center max-w-xs'
                            : 'text-center'
                        }`}
                      >
                        {key === 'color'
                          ? (item[key] === 'Green'
                              ? 'Smatra se sigurnim'
                              : item[key] === 'Yellow'
                              ? 'Konzumirati u manjoj mjeri'
                              : item[key] === 'Red'
                              ? 'Izbjegavati!'
                              : item[key])
                          : key === 'description' && item[key].length > 250
                          ? `${item[key].substring(0, 250)}...`
                          : item[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expanded.has(index) && (
                    <TableRow className={getBackgroundColor(item.color || '')}>
                      <TableCell
                        colSpan={7}
                        className="align-middle"
                      >
                        <div className="p-4 text-left">
                          <strong>Puni opis:</strong>
                          <p className="mt-2">{item.description}</p>
                        </div>
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

export default DatabasePage;