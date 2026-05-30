// src/components/data-loader.tsx
import React from "react";
import { SpinLoader } from "@/components/spin-loader";
import { type ClassValue } from "clsx";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

export type DataLoaderProps<T> = {
  data: T | null | undefined;
  isLoading: boolean;
  error?: Error | string | null;
  emptyMessage?: string;
  children: (data: T) => React.ReactNode;
  wrapperClassName?: ClassValue;
};

export function DataLoader<T>({
  data,
  isLoading,
  error,
  emptyMessage = "No Data Found",
  children,
}: DataLoaderProps<T>) {
  if (isLoading) return <SpinLoader />;

  if (error)
    return (
      <div className="py-10 text-center text-destructive">
        {typeof error === "string"
          ? error
          : error?.message || "Something went wrong"}
      </div>
    );

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return <>{children(data)}</>;
}

export type DataTableLoaderProps<T> = {
  data: T[] | null | undefined;
  isLoading: boolean;
  error?: Error | string | null;
  columns: ColumnDef<T>[];
};

export function DataTableLoader<T>({
  data,
  isLoading,
  error,
  columns,
}: DataTableLoaderProps<T>) {
  return (
    <DataLoader data={data} isLoading={isLoading} error={error}>
      {(data) => <DataTable columns={columns} data={data} />}
    </DataLoader>
  );
}
