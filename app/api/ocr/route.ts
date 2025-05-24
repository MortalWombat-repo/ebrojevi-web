import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    // Validate that an image was provided
    if (!image) {
      console.error('No image file provided in formData');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Log formData contents for debugging
    console.log('FormData contains image:', !!image);

    const maxRetries = 3;
    let attempt = 0;
    let response;

    while (attempt < maxRetries) {
      try {
        response = await fetch('"http://ocr-instance.eba-rzmiwmm2.eu-central-1.elasticbeanstalk.com/ocr"', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json', // Request JSON response
            'User-Agent': 'curl/7.68.0', // Mimic curl's User-Agent
            // Uncomment if OCR service requires authentication
            // 'Authorization': 'Bearer your-api-key',
          },
        });

        // Log response details
        console.log(`Attempt ${attempt + 1} - OCR response status:`, response.status);
        console.log(`Attempt ${attempt + 1} - OCR response headers:`, Object.fromEntries(response.headers));

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Attempt ${attempt + 1} - Non-JSON response from OCR service:`, text.slice(0, 500));
          return NextResponse.json(
            {
              error: 'Failed to process image',
              details: `Expected JSON, but received ${contentType || 'no content-type'}: ${text.slice(0, 500)}`,
            },
            { status: 500 }
          );
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Attempt ${attempt + 1} - OCR error response:`, errorData);
          return NextResponse.json(
            {
              error: 'Failed to process image',
              details: `OCR service failed with status ${response.status}: ${JSON.stringify(errorData)}`,
            },
            { status: response.status }
          );
        }

        break; // Exit loop on success
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          console.error('Max retries reached:', error.message);
          return NextResponse.json(
            {
              error: 'Failed to process image',
              details: `Max retries reached: ${error.message}`,
            },
            { status: 500 }
          );
        }
        console.log(`Retrying request (${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('OCR processing error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Support large images
    },
  },
};