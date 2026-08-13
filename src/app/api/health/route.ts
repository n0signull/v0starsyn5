import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("interests").select("id").limit(1)
    return NextResponse.json({ ok: !error, database: error ? "unavailable" : "connected" }, { status: error ? 503 : 200 })
  } catch {
    return NextResponse.json({ ok: false, database: "not_configured" }, { status: 503 })
  }
}

