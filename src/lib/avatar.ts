export const AVATAR_URL = "https://avatar.vercel.sh";
export const AVATAR_PLACEHOLDER_URL =
  "https://avatar.vercel.sh/placeholder.svg";

type AvatarParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function getAvatarUrl(
  value: string | null | undefined,
  params?: AvatarParams
) {
  if (!value) return AVATAR_PLACEHOLDER_URL;

  const url = new URL(`${AVATAR_URL}/${encodeURIComponent(value)}.svg`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function avatarUrl(
  value: string | null | undefined,
  params?: AvatarParams
) {
  if (!value) return AVATAR_PLACEHOLDER_URL;

  const url = new URL(`${AVATAR_URL}/${encodeURIComponent(value)}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}
