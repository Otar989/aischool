import { query } from "@/lib/db"
import { GlassCard } from "@/components/ui/glass-card"
import { Users, BookOpen, MessageSquare, DollarSign } from "lucide-react"

export default async function AdminDashboard() {
  // Get dashboard statistics
  const [usersResult, coursesResult, paymentsResult, sessionsResult] = await Promise.all([
    query("SELECT COUNT(*) as count FROM users WHERE role = 'user'"),
    query("SELECT COUNT(*) as count FROM courses"),
    query("SELECT COUNT(*) as count, SUM(amount_cents) as revenue FROM orders WHERE status = 'paid'"),
    query("SELECT COUNT(*) as count FROM chat_sessions WHERE created_at >= NOW() - INTERVAL '30 days'"),
  ])

  const stats = {
    users: usersResult.rows.length > 0 ? Number(usersResult.rows[0].count) : 0,
    courses: coursesResult.rows.length > 0 ? Number(coursesResult.rows[0].count) : 0,
    orders: paymentsResult.rows.length > 0 ? Number(paymentsResult.rows[0].count) : 0,
    revenue: paymentsResult.rows.length > 0 ? Number(paymentsResult.rows[0].revenue) || 0 : 0,
    sessions: sessionsResult.rows.length > 0 ? Number(sessionsResult.rows[0].count) : 0,
  }

  // Get recent activity
  const recentUsers = await query(
    "SELECT name, email, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC LIMIT 5",
  )

  const recentOrders = await query(`
    SELECT o.id, o.amount_cents, o.status, o.created_at, u.name as user_name, c.title as course_title
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN courses c ON o.course_id = c.id
    ORDER BY o.created_at DESC LIMIT 5
  `)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Пользователи</p>
              <p className="text-2xl font-bold text-white">{stats.users}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Курсы</p>
              <p className="text-2xl font-bold text-white">{stats.courses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Выручка</p>
              <p className="text-2xl font-bold text-white">{(stats.revenue / 100).toLocaleString()} ₽</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Чат-сессии (30д)</p>
              <p className="text-2xl font-bold text-white">{stats.sessions}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Новые пользователи</h3>
          <div className="space-y-3">
            {recentUsers.rows.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
                <p className="text-white/60 text-sm">{new Date(user.created_at).toLocaleDateString("ru-RU")}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Orders */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Последние заказы</h3>
          <div className="space-y-3">
            {recentOrders.rows.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{order.user_name}</p>
                  <p className="text-white/60 text-sm">
                    {order.course_title || "Подписка"} • {(order.amount_cents / 100).toLocaleString()} ₽
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.status === "paid" ? "Оплачен" : "Ожидает"}
                  </span>
                  <p className="text-white/60 text-sm mt-1">{new Date(order.created_at).toLocaleDateString("ru-RU")}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
