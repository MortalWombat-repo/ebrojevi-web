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
import { Input } from '@/components/ui/input';

interface Additive {
  [key: string]: string; // dynamic keys like code, name, etc.
}

export default function DatabasePage() {
  const [data, setData] = useState<Additive[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://ebrojevi-fast-api.onrender.com/database')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Additives List</h1>
        <p className="text-muted-foreground">
          Use the search box to filter by any field.
        </p>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <TableHead key={key}>{key.toUpperCase()}</TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow
                  key={item.code}
                  className={getBackgroundColor(item.color || '')}
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
    </div>
  );
}
