import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.file?.base64) {
      return NextResponse.json(
        { success: false, error: 'Invalid file data' },
        { status: 400 }
      );
    }

    const base64Data = body.file.base64;

    if (!base64Data.startsWith('data:')) {
      return NextResponse.json(
        { success: false, error: 'Invalid base64 format' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(base64Data.split(',')[1], 'base64');

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'forum-comments',
          resource_type: 'auto',
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Upload failed',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
