import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Allowed file types
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/mkv', 'video/3gp'],
  audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

function getFileCategory(mimeType: string): string {
  for (const [category, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mimeType)) return category;
  }
  return 'other';
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const pathPrefix = (data.get('path') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size is 100MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create safe filename — preserve extension
    const originalName = file.name || 'file';
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
    const baseName = originalName
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9\-_]/g, '_')
      .slice(0, 50);
    const filename = `${Date.now()}_${baseName}.${ext}`;

    // Determine subfolder by category
    const category = getFileCategory(file.type);
    const subFolder = category === 'other' ? pathPrefix : `${pathPrefix}/${category}s`;

    // Save to public/uploads/...
    const uploadDir = join(process.cwd(), 'public', 'uploads', subFolder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      category,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
