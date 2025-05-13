
import React from "react";

interface PaymentStatusBadgeProps {
  status: "paid" | "pending" | "overdue" | "cancelled";
}

const statusMap: Record<string, { text: string, className: string }> = {
  paid: { text: "Pago", className: "bg-green-100 text-green-700 border-green-200" },
  pending: { text: "Pendente", className: "bg-blue-100 text-blue-700 border-blue-200" },
  overdue: { text: "Em Atraso", className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { text: "Cancelado", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMap[status]?.className || ""}`}>
      {statusMap[status]?.text || status}
    </span>
  );
}
