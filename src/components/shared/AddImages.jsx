"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { Loader2, Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fileService } from "@/lib/api-services"
import { getFileUrl } from "@/lib/utils/api-helpers"
import { cn } from "@/lib/utils"
import { toastError, toastSuccess, toastWarning } from "@/lib/toast"

export default function AddImages({
  images,
  setImages,
  maxImages = 10,
  title = "Изображения",
  primaryLabel = "Основное",
  infoText,
  allowMultiple,
  sticky = true,
  disabled = false,
}) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const resolvedAllowMultiple = allowMultiple ?? maxImages > 1
  const isSingleImage = !resolvedAllowMultiple || maxImages === 1
  const resolvedInfoText =
    infoText ??
    (isSingleImage
      ? "Загрузите изображение в формате JPG, PNG, WEBP или SVG."
      : "Первое изображение используется как основное.")

  const handleImageUpload = async (event) => {
    if (disabled) {
      return
    }

    const files = Array.from(event.target.files || [])

    if (files.length === 0) {
      return
    }

    if (isSingleImage && files.length > 1) {
      toastWarning({ title: "Можно загрузить только одно изображение" })
      return
    }

    const shouldReplaceSingle = isSingleImage && images.length === maxImages

    if (!shouldReplaceSingle && files.length + images.length > maxImages) {
      toastWarning({ title: `Максимум ${maxImages} изображений` })
      return
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    const maxSize = 50 * 1024 * 1024

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toastWarning({
          title: `Недопустимый формат: ${file.name}`,
          description: "Разрешены JPG, PNG, GIF, WEBP или SVG.",
        })
        return
      }

      if (file.size > maxSize) {
        toastWarning({
          title: `Файл ${file.name} слишком большой`,
          description: "Максимальный размер — 50MB.",
        })
        return
      }
    }

    setUploading(true)

    try {
      let uploadResult
      if (isSingleImage) {
        const uploadedFile = await fileService.uploadSingle(files[0])
        uploadResult = {
          files: [uploadedFile],
        }
      } else {
        uploadResult = await fileService.uploadMultiple(files)
      }

      const uploadedItems = Array.isArray(uploadResult)
        ? uploadResult
        : Array.isArray(uploadResult?.files)
          ? uploadResult.files
          : []

      const newImages = uploadedItems.map((uploadedFile, index) => {
        const sourceFile = isSingleImage ? files[0] : files[index] || files[0]
        const derivedName = uploadedFile?.filename || uploadedFile?.name || sourceFile?.name || "image"
        const derivedUrl = uploadedFile?.url || uploadedFile?.path || ""

        return {
          id: `${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`,
          file: sourceFile ?? null,
          preview: getFileUrl(derivedUrl),
          url: derivedUrl,
          path: derivedUrl,
          name: derivedName,
          size: uploadedFile?.size ?? sourceFile?.size,
        }
      })

      setImages((prev) => (shouldReplaceSingle ? newImages : [...prev, ...newImages]))
      toastSuccess({
        title: "Загрузка завершена",
        description: `Добавлено ${newImages.length} изображений.`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toastError({
        title: "Ошибка при загрузке изображений",
        description: error.message,
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (id) => {
    if (disabled) {
      return
    }

    const imageToRemove = images.find((image) => image.id === id)
    if (imageToRemove?.preview?.startsWith?.("blob:")) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
    setImages(images.filter((image) => image.id !== id))
  }

  const triggerFileInput = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const buttonText = uploading
    ? "Загрузка..."
    : images.length >= maxImages
      ? `Максимум ${maxImages} изображений`
      : isSingleImage && images.length > 0
        ? "Заменить изображение"
        : "Добавить изображение"

  return (
    <Card className={cn("h-fit", sticky && "sticky top-24")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="h-32 w-full border-2 border-dashed transition-colors hover:border-primary"
          onClick={triggerFileInput}
          disabled={disabled || ((images.length >= maxImages && !isSingleImage) || uploading)}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">{buttonText}</span>
              </>
            ) : (
              <>
                <Plus className="h-8 w-8" />
                <span className="text-sm text-center">{buttonText}</span>
                {resolvedAllowMultiple && (
                  <span className="text-xs">
                    {images.length}/{maxImages}
                  </span>
                )}
              </>
            )}
          </div>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={resolvedAllowMultiple}
          className="hidden"
          disabled={disabled}
          onChange={handleImageUpload}
        />

        {images.length > 0 && (
          <div className={cn("grid gap-3", isSingleImage ? "grid-cols-1" : "grid-cols-2")}>
            {images.map((image) => {
              const altText = image.name || "Изображение"
              return (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 transition-colors hover:border-primary"
                >
                  <Image
                    src={image.preview}
                    alt={altText}
                    fill
                    className="object-cover"
                  />

                  {!disabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {!isSingleImage && images[0]?.id === image.id && (
                    <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-white">
                      {primaryLabel}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {resolvedInfoText && (
          <p className="text-center text-xs text-muted-foreground">{resolvedInfoText}</p>
        )}
      </CardContent>
    </Card>
  )
}
