'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const ocrText = searchParams.get('text');

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>OCR Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-foreground">
            {ocrText || 'No text was detected in the image.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}