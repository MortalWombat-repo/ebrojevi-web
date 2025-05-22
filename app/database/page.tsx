'use client';

import { useState } from 'react';
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

interface AdditivesTableProps {
  additives: Additive[];
}

export function AdditivesTable({ additives }: AdditivesTableProps) {
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
      additive.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      additive.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="search" className="mr-2">
          Search by code or name:
        </label>
        <Input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by code or name"
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