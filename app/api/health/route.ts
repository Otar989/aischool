import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check database connection with Prisma
    await prisma.$queryRaw`SELECT 1`

    // Check environment variables
    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "YOOKASSA_SECRET_KEY", "YOOKASSA_SHOP_ID"]
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

    // Get basic system stats
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      database: "connected",
      stats: {
        users: userCount,
        courses: courseCount,
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
  } finally {
    await prisma.$disconnect()
  }
}
