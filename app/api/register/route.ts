import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Введите имя, email и пароль" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { name },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const userId = data.user?.id
    if (userId) {
      await supabaseAdmin.from("users").insert({ id: userId, email, name, role: "student" })
    }

    return NextResponse.json({ message: "ok" }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
  }
}
