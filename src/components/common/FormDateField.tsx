
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormDateFieldProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  useFancyDatePicker?: boolean;
}

export function FormDateField({
  form,
  name,
  label,
  placeholder = "Selecionar data",
  description,
  disabled = false,
  required = false,
  useFancyDatePicker = false,
}: FormDateFieldProps) {
  // If we want to use the fancy date picker with the calendar popover
  if (useFancyDatePicker) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Default simple date input
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
