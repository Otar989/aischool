export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/serverClient"

export async function POST() {
  if (process.env.ENABLE_SEED_COURSE !== "true") {
    return NextResponse.json({ error: "Seeding disabled" }, { status: 403 })
  }

  try {
    const supabase = supabaseAdmin()

    await supabase
      .rpc("exec_sql", {
        sql: `
        create extension if not exists pgcrypto;
        create table if not exists public.courses (
          id uuid primary key default gen_random_uuid(),
          title text not null,
          slug text unique not null,
          description text,
          price numeric default 0,
          image_url text,
          is_published boolean default true,
          created_at timestamptz default now()
        );
        create table if not exists public.lessons (
          id uuid primary key default gen_random_uuid(),
          course_id uuid references public.courses(id) on delete cascade,
          title text not null,
          content text,
          order_index integer default 1,
          duration integer default 15,
          is_published boolean default true,
          created_at timestamptz default now()
        );
      `,
      })
      .catch(() => {
        /* ignore if function not exists */
      })

    const testCourses = [
      {
        title: "ChatGPT для бизнеса: Автоматизация и продуктивность",
        slug: "chatgpt-business",
        description:
          "Изучите как использовать ChatGPT для автоматизации бизнес-процессов, создания контента и повышения продуктивности команды",
        price: 4999,
        image_url: "/business-automation.png",
      },
      {
        title: "NFT и OpenSea: торговля цифровыми активами",
        slug: "nft-opensea-trading",
        description:
          "Полный гид по торговле NFT на OpenSea. От создания кошелька до продвинутых стратегий инвестирования",
        price: 2999,
        image_url: "/nft-trading-concept.png",
      },
      {
        title: "React и Next.js: современная разработка 2025",
        slug: "react-nextjs-2025",
        description:
          "Изучите современный стек React и Next.js с TypeScript, Tailwind CSS и лучшими практиками 2025 года",
        price: 5999,
        image_url: "/react-nextjs-development.png",
      },
    ]

    const createdCourses = []

    for (const courseData of testCourses) {
      // Check if course already exists
      const { data: existingCourse } = await supabase.from("courses").select("id").eq("slug", courseData.slug).single()

      if (existingCourse) {
        console.log(`[v0] Course ${courseData.slug} already exists`)
        continue
      }

      // Create the course
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert({
          ...courseData,
          is_published: true,
        })
        .select()
        .single()

      if (courseError) {
        console.error(`[v0] Error creating course ${courseData.slug}:`, courseError)
        continue
      }

      // Create sample lessons for each course
      const lessons = [
        {
          title: `Введение в ${courseData.title.split(":")[0]}`,
          content: `Основы работы с ${courseData.title.split(":")[0]}. Изучите базовые концепции и принципы.`,
          order_index: 1,
          duration: 15,
          course_id: course.id,
          is_published: true,
        },
        {
          title: "Практические примеры",
          content: "Разберите реальные кейсы и примеры применения изученного материала.",
          order_index: 2,
          duration: 20,
          course_id: course.id,
          is_published: true,
        },
        {
          title: "Продвинутые техники",
          content: "Изучите продвинутые методы и лучшие практики для профессионального применения.",
          order_index: 3,
          duration: 25,
          course_id: course.id,
          is_published: true,
        },
      ]

      const { error: lessonsError } = await supabase.from("lessons").insert(lessons)

      if (lessonsError) {
        console.error(`[v0] Error creating lessons for ${courseData.slug}:`, lessonsError)
      }

      createdCourses.push(course)
    }

    return NextResponse.json({
      message: `Successfully created ${createdCourses.length} courses`,
      courses: createdCourses,
    })
  } catch (error) {
    console.error("[v0] Seed course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
