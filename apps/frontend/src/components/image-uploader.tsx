"use client";

import React, { useRef, useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

type ImageUploaderProps = {
  onUploaded: (url: string) => void;
};

export const ImageUploader = memo(({ onUploaded }: ImageUploaderProps): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const token = useSelector((s: RootState) => s.auth.token);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = useCallback((): void => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!token) {
      setError('Not authenticated. Please log in.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max size is 5MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Use PNG, JPG, GIF, or WebP.');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      if (data?.url) {
        onUploaded(data.url as string);
        setError(null);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [token, onUploaded]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" className="hidden" onChange={handleChange} />
        <button 
          type="button" 
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handlePick} 
          disabled={isUploading || !token} 
          aria-label="Upload image" 
          tabIndex={0}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {!token && <span className="text-xs text-red-500">Not logged in</span>}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';


