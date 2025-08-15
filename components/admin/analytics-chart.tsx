"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AnalyticsChartProps {
  data: Array<{
    date: string
    value: number
    [key: string]: any
  }>
  type: "revenue" | "users" | "chat"
}

export function AnalyticsChart({ data, type }: AnalyticsChartProps) {
  const formatValue = (value: number) => {
    if (type === "revenue") {
      return `${value.toLocaleString()} ₽`
    }
    return value.toString()
  }

  const ChartComponent = type === "revenue" ? LineChart : BarChart

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickFormatter={formatValue} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value: number) => [
              formatValue(value),
              type === "revenue" ? "Выручка" : type === "users" ? "Пользователи" : "Сессии",
            ]}
          />
          {type === "revenue" ? (
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          ) : (
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
