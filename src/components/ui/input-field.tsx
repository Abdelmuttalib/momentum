import React from "react";
import { type ErrorOption } from "react-hook-form";
import { Input } from "./input";
import { Label } from "./label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelProps?: React.HTMLAttributes<HTMLLabelElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  name: string;
  error?: ErrorOption;
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
        <p className="mt-0.5 text-sm lowercase text-error-500">
          {error.message}
        </p>
      )}
    </div>
  );
}
