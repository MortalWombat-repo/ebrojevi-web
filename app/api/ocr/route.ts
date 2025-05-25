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

    console.log('FormData contains image:', !!image);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch('http://ocr-instance.eba-rzmiwmm2.eu-central-1.elasticbeanstalk.com/ocr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'curl/7.68.0',
            // 'Authorization': 'Bearer your-api-key', // Uncomment if needed
          },
        });

        console.log(`Attempt ${attempt + 1} - OCR response status:`, response.status);

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Attempt ${attempt + 1} - Non-JSON response:`, text.slice(0, 500));
          attempt++;
          if (attempt < maxRetries) {
            console.log(`Retrying (${attempt + 1}/${maxRetries})...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
          }
          continue;
        }

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data); // Success: return data immediately
        } else {
          const errorData = await response.json();
          console.error(`Attempt ${attempt + 1} - OCR error:`, errorData);
          attempt++;
          if (attempt < maxRetries) {
            console.log(`Retrying (${attempt + 1}/${maxRetries})...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Attempt ${attempt + 1} - Fetch error:`, errorMessage);
        attempt++;
        if (attempt < maxRetries) {
          console.log(`Retrying (${attempt + 1}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
        }
      }
    }

    // All attempts failed
    return NextResponse.json(
      { error: 'Failed to process image', details: 'All attempts failed' },
      { status: 500 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('OCR processing error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to process image', details: errorMessage },
      { status: 500 }
    );
  }
}