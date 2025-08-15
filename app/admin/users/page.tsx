import { query } from "@/lib/db"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "@/components/admin/user-actions"

export default async function UsersPage() {
  const users = await query(`
    SELECT 
      u.id, u.name, u.email, u.created_at, u.last_login,
      s.plan as subscription_plan,
      s.status as subscription_status,
      COUNT(e.id) as course_count
    FROM users u
    LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
    LEFT JOIN enrollments e ON u.id = e.user_id
    WHERE u.role = 'user'
    GROUP BY u.id, u.name, u.email, u.created_at, u.last_login, s.plan, s.status
    ORDER BY u.created_at DESC
  `)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Пользователи</h1>
          <p className="text-white/60">Управление пользователями платформы</p>
        </div>
        <Button className="bg-primary hover:bg-primary/80">Экспорт данных</Button>
      </div>

      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-white/80">Пользователь</th>
                <th className="text-left py-3 text-white/80">Подписка</th>
                <th className="text-left py-3 text-white/80">Курсы</th>
                <th className="text-left py-3 text-white/80">Регистрация</th>
                <th className="text-left py-3 text-white/80">Последний вход</th>
                <th className="text-left py-3 text-white/80">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.rows.map((user) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-4">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    {user.subscription_plan ? (
                      <Badge
                        className={`${
                          user.subscription_status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.subscription_plan === "monthly" ? "Месячная" : "Годовая"}
                      </Badge>
                    ) : (
                      <span className="text-white/60">Нет подписки</span>
                    )}
                  </td>
                  <td className="py-4 text-white">{user.course_count}</td>
                  <td className="py-4 text-white/60">{new Date(user.created_at).toLocaleDateString("ru-RU")}</td>
                  <td className="py-4 text-white/60">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString("ru-RU") : "Никогда"}
                  </td>
                  <td className="py-4">
                    <UserActions userId={user.id} />
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
