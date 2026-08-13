import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./supabase/database.types"

type Client = SupabaseClient<Database>

export async function getPublicMemories(client: Client, limit = 24) {
  return client.from("memories").select("*, profiles!memories_author_id_fkey(display_name, avatar_path), events(title), reactions(kind), comments(id)").order("created_at", { ascending: false }).limit(limit)
}

export async function saveProfile(client: Client, userId: string, profile: Database["public"]["Tables"]["profiles"]["Update"], interestIds: number[]) {
  const { error } = await client.from("profiles").update(profile).eq("id", userId)
  if (error) throw error
  const { error: deleteError } = await client.from("profile_interests").delete().eq("profile_id", userId)
  if (deleteError) throw deleteError
  if (interestIds.length) {
    const { error: insertError } = await client.from("profile_interests").insert(interestIds.map((interest_id) => ({ profile_id: userId, interest_id })))
    if (insertError) throw insertError
  }
}

export async function createMemory(client: Client, userId: string, values: { imagePath: string; caption?: string; eventId?: string }) {
  return client.from("memories").insert({ author_id: userId, image_path: values.imagePath, caption: values.caption, event_id: values.eventId }).select().single()
}

export async function toggleReaction(client: Client, memoryId: string, userId: string) {
  const existing = await client.from("reactions").select("memory_id").eq("memory_id", memoryId).eq("user_id", userId).maybeSingle()
  return existing.data
    ? client.from("reactions").delete().eq("memory_id", memoryId).eq("user_id", userId)
    : client.from("reactions").insert({ memory_id: memoryId, user_id: userId, kind: "star" })
}

export async function addComment(client: Client, memoryId: string, userId: string, body: string) {
  const cleanBody = body.trim()
  if (!cleanBody || cleanBody.length > 1000) throw new Error("Comment must be between 1 and 1000 characters")
  return client.from("comments").insert({ memory_id: memoryId, author_id: userId, body: cleanBody }).select().single()
}

