
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface PaymentFiltersProps {
  onFilterChange: (filters: PaymentFilters) => void;
}

interface PaymentFilters {
  unit_id?: string;
  guest_id?: string;
  month?: number;
  year?: number;
  status?: string;
}

interface Unit {
  id: string;
  unit_number: string;
}

interface Guest {
  id: string;
  full_name: string;
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

const statusOptions = [
  { value: "paid", label: "Pago" },
  { value: "pending", label: "Pendente" },
  { value: "overdue", label: "Em Atraso" },
  { value: "cancelled", label: "Cancelado" },
];

// Generate year options from 5 years ago to 5 years ahead
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

export function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filters, setFilters] = useState<PaymentFilters>({});

  useEffect(() => {
    async function fetchData() {
      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from("units")
        .select("id, unit_number")
        .order("unit_number");

      if (unitsError) {
        console.error("Error fetching units:", unitsError);
      } else {
        setUnits(unitsData || []);
      }

      // Fetch guests
      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select("id, full_name")
        .order("full_name");

      if (guestsError) {
        console.error("Error fetching guests:", guestsError);
      } else {
        setGuests(guestsData || []);
      }
    }

    fetchData();
  }, []);

  const updateFilter = (key: keyof PaymentFilters, value: string | number | undefined) => {
    const updatedFilters = { ...filters };
    
    if (value === undefined || value === "") {
      delete updatedFilters[key];
    } else if (key === "month" || key === "year") {
      updatedFilters[key] = typeof value === "string" ? parseInt(value) : value;
    } else {
      updatedFilters[key] = value.toString();
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-md border mb-6">
      <h3 className="text-sm font-medium mb-4">Filtros</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Unit Filter */}
        <div>
          <label className="text-xs text-gray-700">Unidade</label>
          <Select
            value={filters.unit_id || ""}
            onValueChange={(value) => updateFilter("unit_id", value || undefined)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.unit_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Filter */}
        <div>
          <label className="text-xs text-gray-700">Hóspede</label>
          <Select
            value={filters.guest_id || ""}
            onValueChange={(value) => updateFilter("guest_id", value || undefined)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="text-xs text-gray-700">Mês</label>
          <Select
            value={filters.month?.toString() || ""}
            onValueChange={(value) => updateFilter("month", value || undefined)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-xs text-gray-700">Ano</label>
          <Select
            value={filters.year?.toString() || ""}
            onValueChange={(value) => updateFilter("year", value || undefined)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-xs text-gray-700">Status</label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => updateFilter("status", value || undefined)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="text-xs"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
