type TooltipPayloadEntry = {
  payload?: {
    name?: unknown;
  };
};

/** Extracts the full (untruncated) datum name for tooltip titles. */
export function tooltipDatumName(payload: unknown): string {
  const arr = Array.isArray(payload) ? (payload as unknown[]) : [];
  const entry = arr[0] as TooltipPayloadEntry | undefined;
  return typeof entry?.payload?.name === "string" ? entry.payload.name : "";
}
