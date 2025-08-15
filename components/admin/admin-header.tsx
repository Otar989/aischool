import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Bell, LogOut } from "lucide-react"

interface AdminHeaderProps {
  user: {
    id: string
    email: string
    name: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <GlassCard className="m-4 mb-0 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white">Панель администратора</h1>
          <p className="text-white/60">Управление платформой AI Школа</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/60">{user.email}</p>
            </div>

            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
