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
      email_confirm: true, // Auto-confirm for easier testing
      user_metadata: { full_name: name },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const userId = data.user?.id
    if (userId) {
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: userId,
        email,
        full_name: name,
        role: "student",
      })

      if (insertError) {
        console.error("Failed to create user record:", insertError)
      }
    }

    return NextResponse.json(
      {
        message: "Аккаунт успешно создан! Теперь вы можете войти в систему.",
      },
      { status: 200 },
    )
  } catch (e: any) {
    console.error("Registration error:", e)
    return NextResponse.json({ error: "Ошибка сервера. Попробуйте еще раз." }, { status: 500 })
  }
}
