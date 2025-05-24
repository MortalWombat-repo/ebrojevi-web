import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    console.log('Image received:', image);

    if (!image) {
      return NextResponse.json(
        { error: 'No image found in request' },
        { status: 400 }
      );
    }

    const response = await fetch('http://ocr-instance.eba-rzmiwmm2.eu-central-1.elasticbeanstalk.com/ocr', {
      method: 'POST',
      body: formData,
    });

    const text = await response.text(); // for logging
    console.log('OCR Server Response:', response.status, text);

    if (!response.ok) {
      throw new Error(`OCR server error: ${response.status} - ${text}`);
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
