export async function downscaleImage(file: File, maxDimension: number, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file")
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality))
  if (!blob) throw new Error("Unable to process image")
  return blob
}

export async function uploadMemberImage(client: import("@supabase/supabase-js").SupabaseClient, userId: string, file: File, kind: "avatar" | "memory") {
  const bucket = kind === "avatar" ? "avatars" : "memories"
  const maxDimension = kind === "avatar" ? 640 : 1920
  const blob = await downscaleImage(file, maxDimension)
  const path = `${userId}/${crypto.randomUUID()}.webp`
  const { error } = await client.storage.from(bucket).upload(path, blob, { contentType: "image/webp", upsert: false })
  if (error) throw error
  return path
}

