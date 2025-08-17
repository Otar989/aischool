import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { error: connectionError } = await supabase.from("users").select("count", { count: "exact", head: true })

    if (connectionError) {
      throw connectionError
    }

    const requiredEnvVars = [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "YOOKASSA_SECRET_KEY",
      "YOOKASSA_SHOP_ID",
      "YOOKASSA_WEBHOOK_SECRET",
    ]
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: "warning",
          message: `Missing environment variables: ${missingEnvVars.join(", ")}`,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }, // Return 200 but with warning status
      )
    }

    const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

    const { count: courseCount } = await supabase.from("courses").select("*", { count: "exact", head: true })

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      database: "connected",
      stats: {
        users: userCount || 0,
        courses: courseCount || 0,
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
