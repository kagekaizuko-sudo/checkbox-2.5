import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

import { auth } from '@/app/(auth)/auth';

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'File size must be less than 5MB' })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), { message: 'Only JPEG or PNG files are allowed' }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!request.body) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.issues.map((issue) => issue.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const uploadedFile = formData.get('file') as File;
    const filename = `${Date.now()}-${uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename
    const fileBuffer = await file.arrayBuffer();

    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({
      url: blob.url,
      name: uploadedFile.name,
      contentType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}