'use client';

import { useEffect, useState } from 'react';
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('https://ebrojevi-fast-api.onrender.com/database')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const getBackgroundColor = (color = '') => {
    switch (color.toLowerCase()) {
      case 'green':  return 'bg-[#C1E1C1]';
      case 'yellow': return 'bg-[#FFFAA0]';
      case 'red':    return 'bg-[#FAA0A0]';
      default:       return '';
    }
  };

  const toggleRow = (code: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const renderDescription = (item: Additive) => {
    const full = item.description || '';
    const isExpanded = expandedRows.has(item.code);
    if (isExpanded) return full;
    return full.length > 20 ? `${full.slice(0, 20)}…` : full;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2">Additives List</h1>
      <p className="text-muted-foreground mb-4">
        Click a row to toggle full description.
      </p>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              {data[0] && Object.keys(data[0]).map(key => (
                <TableHead key={key}>{key.toUpperCase()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item, i) => (
              <TableRow
                key={item.code || i}
                className={getBackgroundColor(item.color)}
                onClick={() => toggleRow(item.code)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{i + 1}</TableCell>
                {Object.entries(item).map(([key, val]) => (
                  <TableCell key={key}>
                    {key === 'description'
                      ? renderDescription(item)
                      : val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
