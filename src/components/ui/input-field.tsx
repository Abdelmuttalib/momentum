/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from "react";
import { type FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelProps?: React.HTMLAttributes<HTMLLabelElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  name: string;
  error?: FieldError;
}

export default function InputField({
  label,
  name,
  error,
  labelProps,
  containerProps,
  ...rest
}: InputFieldProps) {
  return (
    <div {...containerProps}>
      <Label htmlFor={name} {...labelProps}>
        {label}
      </Label>
      <Input id={name} {...rest} error={error} />
      {error && (
        <p className="mt-0.5 text-sm lowercase text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
