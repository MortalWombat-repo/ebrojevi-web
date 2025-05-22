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
  id: string;
  name: string;
  description: string;
  color: string;
  category: string;
}

export default function DatabasePage() {
  const [data, setData] = useState<Additive[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://ebrojevi-fast-api.onrender.com/database')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  className={getBackgroundColor(item.color)}
                >
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}