-- AlterTable
ALTER TABLE "Label" ADD COLUMN "companyId" TEXT;

-- Backfill: attribute each label to the company of a linked task.
-- Labels never attached to a task keep NULL: they stay preserved in the
-- database but invisible to every company (never returned, never
-- attachable) rather than deleted or mis-attributed.
UPDATE "Label" SET "companyId" = sub."companyId" FROM (
  SELECT tl."A" AS "labelId", MIN(t."companyId") AS "companyId"
  FROM "_TaskLabels" tl JOIN "Task" t ON t."id" = tl."B"
  GROUP BY tl."A"
) AS sub WHERE "Label"."id" = sub."labelId";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN "token" TEXT,
ADD COLUMN "expiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");
CREATE INDEX "Label_companyId_idx" ON "Label"("companyId");

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
