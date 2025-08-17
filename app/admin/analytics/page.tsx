import { getRevenueAnalytics, getUserGrowthAnalytics, getCoursePerformanceAnalytics, getChatAnalytics } from "@/lib/db"
import { GlassCard } from "@/components/ui/glass-card"
import { AnalyticsChart } from "@/components/admin/analytics-chart"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function AnalyticsPage() {
  const revenueData = await getRevenueAnalytics()
  const userGrowthData = await getUserGrowthAnalytics()
  const coursePerformance = await getCoursePerformanceAnalytics()
  const chatAnalytics = await getChatAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Аналитика</h1>
        <p className="text-white/60">Подробная статистика платформы за последние 30 дней</p>
      </div>

      {/* Revenue Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Выручка по дням</h3>
        <AnalyticsChart
          data={revenueData.map((row: any) => ({
            date: new Date(row.date).toLocaleDateString("ru-RU"),
            value: row.revenue / 100,
            orders: row.orders,
          }))}
          type="revenue"
        />
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Рост пользователей</h3>
          <AnalyticsChart
            data={userGrowthData.map((row: any) => ({
              date: new Date(row.date).toLocaleDateString("ru-RU"),
              value: Number.parseInt(row.new_users),
            }))}
            type="users"
          />
        </GlassCard>

        {/* Chat Sessions */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Активность чата</h3>
          <AnalyticsChart
            data={chatAnalytics.map((row: any) => ({
              date: new Date(row.date).toLocaleDateString("ru-RU"),
              value: Number.parseInt(row.sessions),
              avgMessages: Number.parseFloat(row.avg_messages || 0),
            }))}
            type="chat"
          />
        </GlassCard>
      </div>

      {/* Course Performance Table */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Популярность курсов</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-white/80">Курс</th>
                <th className="text-left py-3 text-white/80">Записи</th>
                <th className="text-left py-3 text-white/80">Средний прогресс</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((course: any, index: number) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 text-white">{course.title}</td>
                  <td className="py-3 text-white">{course.enrollments || 0}</td>
                  <td className="py-3 text-white">
                    {course.avg_progress ? `${Math.round(course.avg_progress)}%` : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
