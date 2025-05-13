
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  form: any;
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function FormSelectField({
  form,
  name,
  label,
  options,
  placeholder = "Selecionar...",
  description,
  disabled = false,
  required = false,
  onValueChange,
  className,
}: FormSelectFieldProps) {
  // Validate options to ensure no empty string values
  const validOptions = options.map(option => ({
    value: option.value || "default", // Ensure no empty strings
    label: option.label
  }));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) onValueChange(value);
            }}
            value={field.value ? String(field.value) : "default"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
