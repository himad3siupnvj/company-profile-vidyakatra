export type ImageProcessingStage = "idle" | "compressing" | "uploading"

type OptimizeImageOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const optimizableImageTypes = new Set(["image/jpeg", "image/png", "image/webp"])

function getWebpFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "")

  return `${baseName || "upload"}.webp`
}

function getTargetSize(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export async function optimizeImageForUpload(file: File, options: OptimizeImageOptions = {}) {
  if (!optimizableImageTypes.has(file.type)) return file

  const maxWidth = options.maxWidth ?? 1600
  const maxHeight = options.maxHeight ?? 1200
  const quality = options.quality ?? 0.82
  const image = await createImageBitmap(file)

  try {
    const target = getTargetSize(image.width, image.height, maxWidth, maxHeight)
    const canvas = document.createElement("canvas")
    canvas.width = target.width
    canvas.height = target.height

    const context = canvas.getContext("2d")
    if (!context) return file

    context.drawImage(image, 0, 0, target.width, target.height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality)
    })

    if (!blob) return file

    return new File([blob], getWebpFileName(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    })
  } finally {
    image.close()
  }
}
