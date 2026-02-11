import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { storage } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface IconUploadProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
}

const ALLOWED_TYPES = ['image/png', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const IconUpload = ({
  label,
  currentUrl,
  onUploadComplete,
  onRemove,
}: IconUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Envie apenas PNG sem fundo ou SVG.',
        variant: 'destructive',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo é de 2MB.',
        variant: 'destructive',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const extension = file.type === 'image/svg+xml' ? 'svg' : 'png';
      const filename = `link-icon-${Date.now()}.${extension}`;
      const storageRef = ref(storage, `links/icons/${filename}`);

      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);

      setPreview(url);
      onUploadComplete(url);
      toast({ title: 'Ícone enviado com sucesso!' });
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o ícone.',
        variant: 'destructive',
      });
      console.error('Erro ao fazer upload de ícone:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!preview) return;

    try {
      if (preview.includes('firebasestorage.googleapis.com')) {
        try {
          const path = decodeURIComponent(preview.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, path));
        } catch (error) {
          console.warn('Não foi possível remover o arquivo antigo do storage:', error);
        }
      }

      setPreview('');
      onRemove?.();
      toast({ title: 'Ícone removido.' });
    } catch (error) {
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover o ícone.',
        variant: 'destructive',
      });
      console.error('Erro ao remover ícone:', error);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative rounded-lg border p-4 bg-muted/30">
          <div className="h-16 w-16 flex items-center justify-center">
            <img src={preview} alt="Prévia do ícone" className="w-full h-full object-contain" />
          </div>
          {!uploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        id={`icon-upload-${label}`}
        disabled={uploading}
      />

      <label htmlFor={`icon-upload-${label}`}>
        <Button type="button" variant="outline" className="w-full" disabled={uploading} asChild>
          <span>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {preview ? 'Trocar ícone' : 'Selecionar ícone'}
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
};
