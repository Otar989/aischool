"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Ban, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserActionsProps {
  userId: string
}

export function UserActions({ userId }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/80 backdrop-blur-sm border-white/20">
        <DropdownMenuItem className="text-white hover:bg-white/10">
          <Eye className="w-4 h-4 mr-2" />
          Просмотр профиля
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-white/10">
          <Mail className="w-4 h-4 mr-2" />
          Отправить сообщение
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
          <Ban className="w-4 h-4 mr-2" />
          Заблокировать
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
