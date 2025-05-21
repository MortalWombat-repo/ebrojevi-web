'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Layers, Key } from 'lucide-react';

export default function PristupPage() {
  const [tab, setTab] = useState('dokumentacija');

  return (
    <div className="container max-w-6xl pt-28 pb-16 px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Dokumentacija i API Reference</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Sve što trebate znati o korištenju Cijene API za pristup podacima o cijenama iz hrvatskih trgovačkih lanaca
        </p>
      </motion.div>

      <Tabs defaultValue="dokumentacija" value={tab} onValueChange={setTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dokumentacija">Dokumentacija</TabsTrigger>
            <TabsTrigger value="apiref">API Reference</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dokumentacija" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-blue-500" />
                Početak Rada
              </CardTitle>
              <CardDescription>
                Osnovne informacije za brz početak rada s API-jem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Autentikacija</h3>
              <p className="text-muted-foreground">
                Za pristup API-ju potreban vam je API ključ koji dobivate nakon registracije. API ključ se šalje u zaglavlju svakog zahtjeva.
              </p>
              
              <div className="bg-muted/30 p-4 rounded-md my-4 overflow-x-auto">
                <pre className="text-sm text-white">
{`// Primjer zahtjeva s API ključem
fetch('https://api.cijene.hr/v1/products', {
  headers: {
    'Authorization': 'Bearer VAŠ_API_KLJUČ',
    'Content-Type': 'application/json'
  }
})`}
                </pre>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Osnovni Endpoint-i</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><code className="bg-muted/30 px-1 py-0.5 rounded text-white">/products</code> - Dohvat svih proizvoda</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><code className="bg-muted/30 px-1 py-0.5 rounded text-white">/prices</code> - Dohvat cijena proizvoda</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span><code className="bg-muted/30 px-1 py-0.5 rounded text-white">/stores</code> - Dohvat popisa trgovina</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-blue-500" />
                Primjeri Korištenja
              </CardTitle>
              <CardDescription>
                Detaljni primjeri za različite scenarije korištenja API-ja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium">Dohvat svih proizvoda</h3>
              <div className="bg-muted/30 p-4 rounded-md my-4 overflow-x-auto">
                <pre className="text-sm text-white">
{`// Dohvat svih proizvoda
const response = await fetch('https://api.cijene.hr/v1/products');
const products = await response.json();

console.log(products);`}
                </pre>
              </div>

              <h3 className="text-lg font-medium mt-6">Filtriranje proizvoda po kategoriji</h3>
              <div className="bg-muted/30 p-4 rounded-md my-4 overflow-x-auto">
                <pre className="text-sm text-white">
{`// Filtriranje proizvoda po kategoriji
const response = await fetch('https://api.cijene.hr/v1/products?category=mlijeko');
const milkProducts = await response.json();

console.log(milkProducts);`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apiref" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5 text-blue-500" />
                API Reference
              </CardTitle>
              <CardDescription>
                Detaljan pregled svih dostupnih endpoint-a i parametara
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">GET /products</h3>
                  <p className="text-muted-foreground mb-4">Dohvat svih proizvoda s mogućnošću filtriranja</p>
                  
                  <h4 className="text-md font-medium mt-4 mb-2">Parametri upita</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-4 text-sm font-medium">Parametar</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Tip</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Opis</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-4 text-sm font-mono">category</td>
                        <td className="py-2 px-4 text-sm">string</td>
                        <td className="py-2 px-4 text-sm">Filtriranje po kategoriji proizvoda</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-4 text-sm font-mono">store</td>
                        <td className="py-2 px-4 text-sm">string</td>
                        <td className="py-2 px-4 text-sm">Filtriranje po trgovini</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-4 text-sm font-mono">limit</td>
                        <td className="py-2 px-4 text-sm">number</td>
                        <td className="py-2 px-4 text-sm">Broj rezultata po stranici (default: 20)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-sm font-mono">page</td>
                        <td className="py-2 px-4 text-sm">number</td>
                        <td className="py-2 px-4 text-sm">Broj stranice (default: 1)</td>
                      </tr>
                    </tbody>
                  </table>

                  <h4 className="text-md font-medium mt-6 mb-2">Odgovor</h4>
                  <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm text-white">
{`{
  "data": [
    {
      "id": "p123",
      "name": "Mlijeko Z 2.8% m.m. 1L",
      "category": "mlijeko",
      "barcode": "3850123456789",
      "store": "trgovina-a"
    },
    {
      "id": "p124",
      "name": "Mlijeko Y 3.2% m.m. 1L",
      "category": "mlijeko", 
      "barcode": "3850123456790",
      "store": "trgovina-b"
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">GET /prices</h3>
                  <p className="text-muted-foreground mb-4">Dohvat cijena za određene proizvode</p>
                  
                  <h4 className="text-md font-medium mt-4 mb-2">Parametri upita</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-4 text-sm font-medium">Parametar</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Tip</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Opis</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-4 text-sm font-mono">product_id</td>
                        <td className="py-2 px-4 text-sm">string</td>
                        <td className="py-2 px-4 text-sm">ID proizvoda</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-4 text-sm font-mono">date_from</td>
                        <td className="py-2 px-4 text-sm">date</td>
                        <td className="py-2 px-4 text-sm">Početni datum za povijesne cijene</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-sm font-mono">date_to</td>
                        <td className="py-2 px-4 text-sm">date</td>
                        <td className="py-2 px-4 text-sm">Završni datum za povijesne cijene</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}