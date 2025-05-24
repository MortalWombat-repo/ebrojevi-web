import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    // Validate that an image was provided
    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const response = await fetch('http://ocr-instance.eba-rzmiwmm2.eu-central-1.elasticbeanstalk.com/ocr', {
      method: 'POST',
      body: formData,
      headers: {
        // Ensure the Content-Type is set appropriately if required by the OCR service
        // 'Content-Type': 'multipart/form-data' is automatically set by the browser when using FormData
      },
    });

    console.log('OCR response status:', response.status);
    console.log('OCR response headers:', response.headers.get('content-type'));

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response from OCR service:', text.slice(0, 100)); // Log first 100 chars
      throw new Error(`Expected JSON, but received ${contentType || 'no content-type'}: ${text.slice(0, 100)}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OCR error response:', errorData);
      throw new Error(`OCR service failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('OCR processing error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process image', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Increase body size limit if large images are expected
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust as needed
    },
  },
};