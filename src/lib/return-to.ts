/**
 * Client-safe return-URL validation. Returns true only for same-origin
 * relative paths ("/tasks", "/projects/abc/tasks"). Rejects absolute URLs,
 * protocol-relative URLs, backslash tricks and non-strings — prevents open
 * redirects after login.
 */
export function isSafeReturnTo(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\") &&
    !value.includes(":") &&
    !value.includes("\\")
  );
}

export function safeReturnTo(value: unknown, fallback = "/overview") {
  return isSafeReturnTo(value) ? value : fallback;
}
