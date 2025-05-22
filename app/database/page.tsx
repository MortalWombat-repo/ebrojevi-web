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
      cache: 'no-store',
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
        <div className="mt-4">
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
    </div>
  );
}