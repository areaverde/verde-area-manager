
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { FormDateField } from "@/components/common/FormDateField";
import { FormTextField } from "@/components/common/FormTextField";
import { usePaymentForm } from "./usePaymentForm";
import { PaymentFormActions } from "./PaymentFormActions";
import { PaymentStaySelector } from "./PaymentStaySelector";
import { PaymentAmountField } from "./PaymentAmountField";
import { PaymentMonthYearFields } from "./PaymentMonthYearFields";
import { PaymentStatusField } from "./PaymentStatusField";

interface PaymentFormProps {
  initialData?: {
    id: string;
    stay_id: string;
    payment_date: string;
    amount_paid: number;
    reference_month: number;
    reference_year: number;
    status: string;
    notes: string | null;
  } | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSuccess: () => void;
}

interface Stay {
  id: string;
  monthly_rent: number;
  units: {
    unit_number: string;
  };
  guests: {
    full_name: string;
  };
}

export function PaymentForm({ initialData, mode, onCancel, onSuccess }: PaymentFormProps) {
  const [selectedStayRent, setSelectedStayRent] = useState<number>(
    initialData?.stay_id ? 0 : 0
  );
  
  const { form, loading, onSubmit } = usePaymentForm({
    payment: initialData,
    mode,
    onSuccess,
  });

  const handleSelectedStayChange = (stay: Stay | undefined) => {
    if (stay) {
      setSelectedStayRent(stay.monthly_rent);
      form.setValue("amount_paid", stay.monthly_rent);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentStaySelector
            form={form}
            loading={loading}
            mode={mode}
            onSelectedStayChange={handleSelectedStayChange}
          />

          <FormDateField
            form={form}
            name="payment_date"
            label="Data do Pagamento"
            disabled={loading}
            required={true}
          />

          <PaymentAmountField
            form={form}
            loading={loading}
            selectedStayRent={selectedStayRent}
          />

          <PaymentMonthYearFields
            form={form}
            loading={loading}
          />

          <PaymentStatusField
            form={form}
            loading={loading}
          />

          <FormTextField
            form={form}
            name="notes"
            label="Observações"
            multiline={true}
            disabled={loading}
            className="col-span-2"
          />
        </div>

        <PaymentFormActions
          mode={mode}
          loading={loading}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}
