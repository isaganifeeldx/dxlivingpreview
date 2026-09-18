const SKIP_TYPES = new Set(['image/webp', 'image/svg+xml', 'image/gif'])

/**
 * Convert raster images to WebP in the browser before upload.
 * Skips WebP (already), SVG, and GIF (may be animated).
 */
export async function convertImageFileToWebp(
  file: File,
  quality = 0.82,
): Promise<File> {
  if (!file.type.startsWith('image/') || SKIP_TYPES.has(file.type)) {
    return file
  }

  // Older Safari may not support canvas webp output.
  const supportsWebp =
    typeof document !== 'undefined' &&
    document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')

  if (!supportsWebp) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }

    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality)
    })

    if (!blob) return file

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}
