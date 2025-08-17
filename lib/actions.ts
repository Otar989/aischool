"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { logger, maskEmail } from "@/lib/logger"

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
  logger.debug("[v0] SignIn action called")

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
    logger.debug({ email: maskEmail(email.toString()) }, "[v0] Attempting to sign in user")

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      logger.error({ err: error }, "[v0] Sign in error")
      return { error: error.message }
    }

    logger.info("[v0] Sign in successful")
    return { success: true }
  } catch (error) {
    logger.error({ err: error }, "[v0] Login error")
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  logger.debug("[v0] SignUp action called")

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
    logger.debug({ email: maskEmail(email.toString()) }, "[v0] Attempting to sign up user")

    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard`,
      },
    })

    if (error) {
      logger.error({ err: error }, "[v0] Sign up error")
      return { error: error.message }
    }

    logger.info("[v0] Sign up successful")
    return { success: "Check your email to confirm your account." }
  } catch (error) {
    logger.error({ err: error }, "[v0] Sign up error")
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/login")
}
