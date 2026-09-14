-- Index-only migration for task analytics reads.
-- The effortPoints/startedAt/completedAt columns already exist in the
-- database (added manually); this migration MUST NOT touch columns or data.
CREATE INDEX IF NOT EXISTS "Task_companyId_status_idx" ON "Task"("companyId", "status");
CREATE INDEX IF NOT EXISTS "Task_companyId_projectId_idx" ON "Task"("companyId", "projectId");
CREATE INDEX IF NOT EXISTS "Task_assigneeId_idx" ON "Task"("assigneeId");
