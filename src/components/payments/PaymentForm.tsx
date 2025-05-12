
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePaymentForm } from "./usePaymentForm";
import { supabase } from "@/lib/supabase";
import { PaymentFormActions } from "./PaymentFormActions";

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

const months = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export function PaymentForm({ initialData, mode, onCancel, onSuccess }: PaymentFormProps) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [selectedStayRent, setSelectedStayRent] = useState<number>(0);
  const { form, loading, onSubmit } = usePaymentForm({
    payment: initialData,
    mode,
    onSuccess,
  });

  // Load active stays
  useEffect(() => {
    async function fetchStays() {
      const { data, error } = await supabase
        .from("stays")
        .select(`
          id,
          monthly_rent,
          units:unit_id(unit_number),
          guests:guest_id(full_name)
        `)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching stays:", error);
      } else {
        setStays(data || []);
        
        // If editing, or if there's only one stay available, set the rent
        if (initialData?.stay_id) {
          const selectedStay = data?.find(stay => stay.id === initialData.stay_id);
          if (selectedStay) {
            setSelectedStayRent(selectedStay.monthly_rent);
          }
        }
      }
    }

    fetchStays();
  }, [initialData?.stay_id]);
  
  // Update rent amount when stay changes
  const handleStayChange = (stayId: string) => {
    const selectedStay = stays.find(stay => stay.id === stayId);
    if (selectedStay) {
      setSelectedStayRent(selectedStay.monthly_rent);
      form.setValue("amount_paid", selectedStay.monthly_rent);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stay Selection */}
          <FormField
            control={form.control}
            name="stay_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estadia</FormLabel>
                <Select
                  disabled={loading || mode === "edit"}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleStayChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma estadia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stays.map((stay) => (
                      <SelectItem key={stay.id} value={stay.id}>
                        {stay.units.unit_number} - {stay.guests.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Date */}
          <FormField
            control={form.control}
            name="payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Pagamento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount Paid */}
          <FormField
            control={form.control}
            name="amount_paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Pago (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                {selectedStayRent > 0 && (
                  <div className="text-xs text-gray-500">
                    Valor mensal da estadia: R$ {selectedStayRent.toFixed(2)}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Month */}
          <FormField
            control={form.control}
            name="reference_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês de Referência</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Year */}
          <FormField
            control={form.control}
            name="reference_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano de Referência</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2000"
                    max="2100"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="overdue">Em Atraso</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
