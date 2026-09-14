-- AlterTable
-- No backfill: existing INVITED rows keep inviteCode NULL and require admin
-- regeneration before redemption (see application logic). REGISTERED history
-- is untouched.
ALTER TABLE "Invitation" ADD COLUMN "inviteCode" TEXT,
ADD COLUMN "failedAttempts" INTEGER NOT NULL DEFAULT 0;
