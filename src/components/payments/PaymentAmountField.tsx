
import { FormTextField } from "@/components/common/FormTextField";

interface PaymentAmountFieldProps {
  form: any;
  loading: boolean;
  selectedStayRent: number;
}

export function PaymentAmountField({ 
  form, 
  loading, 
  selectedStayRent 
}: PaymentAmountFieldProps) {
  return (
    <div>
      <FormTextField
        form={form}
        name="amount_paid"
        label="Valor Pago (R$)"
        type="number"
        disabled={loading}
        required={true}
      />
      {selectedStayRent > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Valor mensal da estadia: R$ {selectedStayRent.toFixed(2)}
        </p>
      )}
    </div>
  );
}
