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
  try {
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

    // Function to assign specific widths and centering to column headers
    const getHeaderClass = (key: string) => {
      const baseClasses = 'text-center'; // Horizontal centering for headers
      switch (key) {
        case 'code':
          return `${baseClasses} w-[100px]`;
        case 'name':
          return `${baseClasses} w-[200px]`; // Fixed width to reduce whitespace
        case 'description':
          return 'max-w-[300px]'; // Left-aligned for readability
        case 'type':
          return `${baseClasses} w-[100px]`;
        case 'adi':
          return `${baseClasses} w-[100px]`;
        default:
          return baseClasses;
      }
    };

    // Function to apply vertical centering to table cells
    const getCellClass = (key: string) => {
      const baseClasses = 'whitespace-normal p-2';
      if (['#', 'code', 'name', 'type', 'adi'].includes(key)) {
        return `${baseClasses} flex items-center`; // Vertical centering
      }
      return `${baseClasses} align-top`; // Description remains top-aligned
    };

    // Filter out the 'color' key for table headers and cells
    const visibleColumns = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'color') : [];

    return (
      <div className="container mx-auto py-10 text-gray-800">
        <div className="flex flex-col gap-4">
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
          </div>
          <p className="text-muted-foreground">
            Prikaz svih E-brojeva aditiva s redovima označenim bojama.
          </p>
          <div className="rounded-md border overflow-auto">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">#</TableHead>
                  {visibleColumns.map((key) => (
                    <TableHead key={key} className={getHeaderClass(key)}>
                      {key.toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={item.code || index}
                    className={`transition-all duration-200 ${getBackgroundColor(item.color || '')}`}
                  >
                    <TableCell className={getCellClass('#')}>
                      {index + 1}
                    </TableCell>
                    {visibleColumns.map((key, idx) => (
                      <TableCell
                        key={idx}
                        className={getCellClass(key)}
                      >
                        {item[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Došlo je do pogreške prilikom dohvaćanja podataka. Pokušajte ponovno kasnije.';
    return (
      <div className="container mx-auto py-10 text-red-600">
        <h1>Pogreška</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }
}