"use client"

import { Badge } from "@/components/ui/badge"

type StatusBadgesProps = {
  statusLabel?: string
  statusValue?: string
  statusColor?: string
  paymentLabel?: string
  paymentValue?: string
  showPayment?: boolean
}

export default function StatusBadges({
  statusLabel = "Status",
  statusValue = "Collecting",
  statusColor = "#2563eb",
  paymentLabel = "Payment",
  paymentValue = "Not Paid",
  showPayment = false,
}: StatusBadgesProps) {
  const toBadgeStyle = (hex: string) => {
    if (!hex || typeof hex !== "string") {
      return {
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        color: "#1d4ed8",
        borderColor: "rgba(37, 99, 235, 0.2)",
      }
    }

    const normalized = hex.replace("#", "")
    const bigint = parseInt(normalized, 16)
    if (Number.isNaN(bigint)) {
      return {
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        color: "#1d4ed8",
        borderColor: "rgba(37, 99, 235, 0.2)",
      }
    }
    const isShort = normalized.length === 3
    const r = isShort ? ((bigint >> 8) & 0xf) * 17 : (bigint >> 16) & 255
    const g = isShort ? ((bigint >> 4) & 0xf) * 17 : (bigint >> 8) & 255
    const b = isShort ? (bigint & 0xf) * 17 : bigint & 255
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.12)` ,
      color: `rgb(${r}, ${g}, ${b})`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.25)` ,
    }
  }

  const statusStyle = toBadgeStyle(statusColor)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        className="rounded-full border px-3 py-1 text-sm font-medium"
        style={statusStyle}
      >
        {statusLabel}: {statusValue}
      </Badge>
      {showPayment && (
        <Badge className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
          {paymentLabel}: {paymentValue}
        </Badge>
      )}
    </div>
  )
}
