
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface Payment {
  id: string;
  stay_id: string;
  payment_date: string;
  amount_paid: number;
  reference_month: number;
  reference_year: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  notes: string | null;
  stays: {
    units: {
      unit_number: string;
    };
    guests: {
      full_name: string;
    };
  };
}

interface PaymentRowProps {
  payment: Payment;
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
  formatMonthYear: (month: number, year: number) => string;
  onEdit: (payment: Payment) => void;
}

export function PaymentRow({
  payment,
  formatDate,
  formatCurrency,
  formatMonthYear,
  onEdit,
}: PaymentRowProps) {
  return (
    <TableRow>
      <TableCell>{payment.stays?.units?.unit_number || "—"}</TableCell>
      <TableCell>{payment.stays?.guests?.full_name || "—"}</TableCell>
      <TableCell>{formatMonthYear(payment.reference_month, payment.reference_year)}</TableCell>
      <TableCell>{formatCurrency(payment.amount_paid)}</TableCell>
      <TableCell>{formatDate(payment.payment_date)}</TableCell>
      <TableCell>
        <PaymentStatusBadge status={payment.status} />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(payment)}
        >
          Detalhes
        </Button>
      </TableCell>
    </TableRow>
  );
}
