import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Use relative path in development to avoid CORS errors when NEXT_PUBLIC_API_URL points to prod
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
     return path.startsWith('/') ? path : `/${path}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
