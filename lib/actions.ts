"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface AuthActionState {
  error?: string
  success?: boolean | string
}

interface AuthFormData {
  email: string
  password: string
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  console.log("[v0] SignIn action called")

  if (!formData) {
    return { error: "Form data is missing" }
  }

  const { email, password } = Object.fromEntries(formData) as Partial<AuthFormData>

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    console.log("[v0] Attempting to sign in user:", email)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      console.log("[v0] Sign in error:", error.message)
      return { error: error.message }
    }

    console.log("[v0] Sign in successful")
    return { success: true }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  console.log("[v0] SignUp action called")

  if (!formData) {
    return { error: "Form data is missing" }
  }

  const { email, password } = Object.fromEntries(formData) as Partial<AuthFormData>

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    console.log("[v0] Attempting to sign up user:", email)

    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard`,
      },
    })

    if (error) {
      console.log("[v0] Sign up error:", error.message)
      return { error: error.message }
    }

    console.log("[v0] Sign up successful")
    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/login")
}
