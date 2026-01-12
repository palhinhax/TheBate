"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";
import { Upload, X, ImageIcon } from "lucide-react";

interface EditTopicImageProps {
  topicSlug: string;
  currentImageUrl: string | null;
}

export default function EditTopicImage({ topicSlug, currentImageUrl }: EditTopicImageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t("common.error", "Erro"),
        description: "Tipo de ficheiro inválido. Apenas JPG, PNG, WebP e GIF são permitidos.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: t("common.error", "Erro"),
        description: "Ficheiro demasiado grande. Tamanho máximo: 5MB",
        variant: "destructive",
      });
      return;
    }

    // Store file and show preview
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Erro ao fazer upload da imagem");
      }

      const { imageUrl: uploadedUrl } = await uploadResponse.json();

      // Update topic with new image URL
      const updateResponse = await fetch(`/api/topics/${topicSlug}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.error || "Erro ao atualizar tema");
      }

      toast({
        title: t("topics.image_updated", "Imagem atualizada!"),
        description: t("topics.image_updated_desc", "A imagem do tema foi atualizada com sucesso."),
      });

      setSelectedFile(null);
      router.refresh();
    } catch (error: unknown) {
      toast({
        title: t("common.error", "Erro"),
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setImagePreview(currentImageUrl);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setImagePreview(currentImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const response = await fetch(`/api/topics/${topicSlug}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: null }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao remover imagem");
      }

      setImagePreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: t("topics.image_removed", "Imagem removida"),
        description: t("topics.image_removed_desc", "A imagem do tema foi removida."),
      });

      router.refresh();
    } catch (error: unknown) {
      toast({
        title: t("common.error", "Erro"),
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <ImageIcon className="mr-2 h-5 w-5" />
        {t("topics.edit_image", "Editar Imagem do Tema")}
      </h3>

      {imagePreview ? (
        <div className="relative overflow-hidden rounded-lg border">
          <img src={imagePreview} alt="Topic image" className="h-64 w-full object-cover" />
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveImage}
              disabled={isUploading || selectedFile !== null}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white">{t("topics.uploading_image", "A carregar...")}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
          <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-sm text-muted-foreground">{t("topics.no_image", "Sem imagem")}</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading
              ? t("topics.uploading_image", "A carregar...")
              : t("topics.upload_image", "Carregar Imagem")}
          </Button>
        </div>
      )}

      {selectedFile && (
        <div className="mt-4 flex gap-2">
          <Button onClick={handleSaveImage} disabled={isUploading} className="flex-1">
            {isUploading ? t("topics.uploading_image", "A carregar...") : t("common.save", "Guardar")}
          </Button>
          <Button onClick={handleCancelImage} disabled={isUploading} variant="outline">
            {t("common.cancel", "Cancelar")}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleImageSelect}
        className="hidden"
        disabled={isUploading}
      />

      <p className="mt-4 text-xs text-muted-foreground">
        {t("topics.image_requirements", "JPG, PNG, WebP ou GIF. Máximo 5MB.")}
      </p>
    </div>
  );
}
