// app/database/page.tsx
import React from 'react';
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
  const res = await fetch(
    'https://ebrojevi-fast-api.onrender.com/database',
    {
      // never fetch this from the browser
      cache: 'no-store'
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch additives: ${res.status}`);
  }
  return res.json();
}

export default async function DatabasePage() {
  const data = await getAdditives();

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
          Displaying all E-number additives with color-coded rows.
        </p>
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
              {data.map((item, index) => (
                <TableRow
                  key={item.code || index}
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