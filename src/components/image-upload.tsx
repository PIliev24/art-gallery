import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export function ImageUpload({ value, onChange, required }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Позволени са само изображения (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Файлът е твърде голям. Максимум 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Грешка при качване' }));
        throw new Error(body.error || 'Грешка при качване');
      }

      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при качване');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  if (value) {
    return (
      <div className="relative group w-full max-w-xs">
        <div className="aspect-[4/3] overflow-hidden border border-[var(--color-gallery-700)] rounded">
          <img
            src={value}
            alt="Преглед"
            className="h-full w-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-2 right-2 p-1.5 bg-[var(--color-gallery-900)]/80 text-[var(--color-gallery-100)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-gallery-900)]"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed rounded cursor-pointer transition-colors ${
          dragOver
            ? 'border-[var(--color-gold-500)] bg-[var(--color-gold-500)]/5'
            : 'border-[var(--color-gallery-700)] hover:border-[var(--color-gallery-500)]'
        }`}
      >
        {uploading ? (
          <Loader2 size={24} className="text-[var(--color-gold-500)] animate-spin" />
        ) : (
          <Upload size={24} className="text-[var(--color-gallery-500)]" />
        )}
        <p className="text-sm text-[var(--color-gallery-400)]">
          {uploading ? 'Качване...' : 'Плъзнете или кликнете за избор'}
        </p>
        <p className="text-xs text-[var(--color-gallery-600)]">
          JPEG, PNG, WebP — до 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        required={required && !value}
      />
      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
