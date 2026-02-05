import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Check, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';
import type { Area } from 'react-easy-crop';

interface ImageUploadProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: 'desktop' | 'mobile' | 'avatar';
  maxWidth?: number;
  maxHeight?: number;
  enableCrop?: boolean;
}

export const ImageUpload = ({
  label,
  currentUrl,
  onUploadComplete,
  onRemove,
  aspectRatio = 'desktop',
  maxWidth,
  maxHeight,
  enableCrop = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do crop
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Configurações por tipo
  const configs = {
    desktop: { w: 1920, h: 1080, aspect: 16/9, display: 'aspect-video' },
    mobile: { w: 1080, h: 1920, aspect: 9/16, display: 'aspect-[9/16]' },
    avatar: { w: 400, h: 533, aspect: 3/4, display: 'aspect-[3/4]' },
  };

  const config = configs[aspectRatio];
  const width = maxWidth || config.w;
  const height = maxHeight || config.h;
  const shouldCrop = enableCrop || aspectRatio === 'avatar';

  // Converte Area para File croppado
  const getCroppedImage = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas context error');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', reject);
      img.src = url;
    });
  };

  // Otimiza imagem
  const optimizeImage = async (file: File): Promise<File> => {
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: Math.max(width, height),
        useWebWorker: true,
        fileType: 'image/jpeg',
      });
      console.log(`Comprimido: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
      return compressed;
    } catch (err) {
      console.error('Erro ao comprimir:', err);
      return file;
    }
  };

  // Upload para Firebase
  const uploadImage = async (file: File): Promise<string> => {
    const folder = aspectRatio === 'avatar' ? 'team_GD' : 'banners_GD';
    const filename = `${aspectRatio}-${Date.now()}.jpg`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Quando seleciona arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Erro', description: 'Selecione uma imagem válida', variant: 'destructive' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Erro', description: 'Imagem muito grande (máx 10MB)', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;

      if (shouldCrop) {
        setImageSrc(result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setCropDialogOpen(true);
      } else {
        processImage(file);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Processa sem crop
  const processImage = async (file: File) => {
    setUploading(true);
    try {
      const optimized = await optimizeImage(file);
      const url = await uploadImage(optimized);
      setPreview(url);
      onUploadComplete(url);
      toast({ title: 'Sucesso!', description: 'Imagem enviada' });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  // Callback do cropper
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Confirma crop
  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setCropDialogOpen(false);
    setUploading(true);

    try {
      const croppedFile = await getCroppedImage(imageSrc, croppedAreaPixels);
      const optimized = await optimizeImage(croppedFile);
      const url = await uploadImage(optimized);

      setPreview(url);
      onUploadComplete(url);
      toast({ title: 'Sucesso!', description: 'Imagem cortada e enviada' });

      setImageSrc(null);
      setCroppedAreaPixels(null);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  // Cancela crop
  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // Remove imagem
  const handleRemove = async () => {
    if (!currentUrl) return;

    try {
      if (currentUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const path = decodeURIComponent(currentUrl.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, path));
        } catch (e) {
          console.warn('Não foi possível deletar do storage:', e);
        }
      }

      setPreview(null);
      onRemove?.();
      toast({ title: 'Removida' });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground">
        {label} • {width}×{height}px
      </Label>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border bg-muted/50">
          <div className={`${config.display} ${
            aspectRatio === 'avatar' ? 'max-w-[200px] mx-auto' :
            aspectRatio === 'mobile' ? 'max-w-[180px] mx-auto' : ''
          }`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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

          {uploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`upload-${aspectRatio}-${label}`}
          disabled={uploading}
        />
        <label htmlFor={`upload-${aspectRatio}-${label}`}>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {preview ? 'Trocar' : 'Selecionar'}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {preview && !uploading && (
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <Check className="w-3 h-3" />
          <span>Salva</span>
        </div>
      )}

      {/* MODAL DE CROP - REDESENHADO */}
      <Dialog open={cropDialogOpen} onOpenChange={handleCropCancel}>
        <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Ajustar Imagem
            </DialogTitle>
          </DialogHeader>

          {/* Área do Cropper */}
          <div className="relative w-full h-[60vh] bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={config.aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={true}
                objectFit="vertical-cover"
                minZoom={1}
                maxZoom={3}
              />
            )}
          </div>

          {/* Controles */}
          <div className="p-4 border-t space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm shrink-0">Zoom: {Math.round(zoom * 100)}%</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCropCancel}>
                Cancelar
              </Button>
              <Button onClick={handleCropConfirm} disabled={!croppedAreaPixels}>
                <Check className="w-4 h-4 mr-2" />
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
