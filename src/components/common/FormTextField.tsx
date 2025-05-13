
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormTextFieldProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  className?: string;
}

export function FormTextField({
  form,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  required = false,
  type = "text",
  multiline = false,
  className,
}: FormTextFieldProps) {
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
          <FormControl>
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ""}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={type === "number" && field.value === null ? "" : field.value || ""}
                step={type === "number" ? "0.01" : undefined}
              />
            )}
          </FormControl>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
