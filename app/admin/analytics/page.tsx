import { query } from "@/lib/db"
import { GlassCard } from "@/components/ui/glass-card"
import { AnalyticsChart } from "@/components/admin/analytics-chart"

export default async function AnalyticsPage() {
  // Revenue analytics
  const revenueData = await query(`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      SUM(amount_cents) as revenue,
      COUNT(*) as orders
    FROM orders 
    WHERE status = 'paid' AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `)

  // User growth
  const userGrowthData = await query(`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as new_users
    FROM users 
    WHERE role = 'user' AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `)

  // Course performance
  const coursePerformance = await query(`
    SELECT 
      c.title,
      COUNT(e.id) as enrollments,
      AVG(cp.progress_percent) as avg_progress
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id
    LEFT JOIN course_progress cp ON c.id = cp.course_id
    GROUP BY c.id, c.title
    ORDER BY enrollments DESC
    LIMIT 10
  `)

  // Chat session analytics
  const chatAnalytics = await query(`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as sessions,
      AVG(message_count) as avg_messages
    FROM chat_sessions 
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `)

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
          data={revenueData.rows.map((row) => ({
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
            data={userGrowthData.rows.map((row) => ({
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
            data={chatAnalytics.rows.map((row) => ({
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
              {coursePerformance.rows.map((course, index) => (
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
