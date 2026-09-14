import { randomInt, timingSafeEqual } from "crypto";

export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const INVITE_MAX_ATTEMPTS = 10;
export const INVITE_EXPIRY_DAYS = 7;

export function inviteExpiryDate(from = new Date()) {
  return new Date(from.getTime() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

/** 6-char human-friendly code from a CSPRNG, ambiguous chars excluded. */
export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[randomInt(INVITE_CODE_ALPHABET.length)];
  }
  return code;
}

export function normalizeInviteCode(value: string): string {
  return value.trim().toUpperCase();
}

/**
 * Fixed-length comparison to avoid unnecessary timing leakage.
 * Both sides are normalized first; always compares full length.
 */
export function verifyInviteCode(input: string, stored: string): boolean {
  const a = normalizeInviteCode(input);
  const b = normalizeInviteCode(stored);
  if (a.length !== INVITE_CODE_LENGTH || b.length !== INVITE_CODE_LENGTH) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
