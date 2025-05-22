'use client'

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DatabasePage() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(
          'https://ebrojevi-fast-api.onrender.com/database',
          {
            cache: 'no-store',
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch additives: ${res.status}`);
        }
        const additives = await res.json();
        setData(additives);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute filtered data based on search term
  const filteredData = data
    ? data.filter((item) =>
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Function to get background color based on item.color
  const getBackgroundColor = (color = '') => {
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
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-muted-foreground">Additives List</h1>
        </div>
        <p className="text-muted-foreground">
          Displaying all E-number additives with color-coded rows.
        </p>
        <input
          type="text"
          placeholder="Search by code (e.g., E100) or name (e.g., Curcumin)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-center">No data found</p>
        ) : (
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
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={(data.length > 0 ? Object.keys(data[0]).length : 0) + 1}
                      className="text-center"
                    >
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item.code || index}
                      className={`transition-all duration-200 ${getBackgroundColor(item.color)}`}
                    >
                      <TableCell>{index + 1}</TableCell>
                      {Object.values(item).map((value, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}