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

  const handlePick = useCallback((): void => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (data?.url) onUploaded(data.url as string);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [token, onUploaded]);

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={handlePick} disabled={isUploading} aria-label="Upload image" tabIndex={0}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';


