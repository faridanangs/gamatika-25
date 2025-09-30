// src/app/api/test-cloudinary/route.js
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
    };

    // Test Cloudinary connection
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test upload with a small image
    const testImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    const testResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${testImage.toString('base64')}`,
      {
        folder: 'forum-deltacivitas',
        public_id: 'test-upload',
      }
    );

    // Clean up test image
    await cloudinary.uploader.destroy(testResult.public_id);

    return Response.json({
      success: true,
      environment: envCheck,
      cloudinary_ping: await cloudinary.api.ping(),
      test_upload: {
        success: true,
        url: testResult.secure_url,
        public_id: testResult.public_id,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
        environment: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
          api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
        },
      },
      { status: 500 }
    );
  }
}
