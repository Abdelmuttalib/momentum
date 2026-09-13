/**
 * Demo-data entrypoint: `COMPANY_ID=... npm run db:seed:demo [-- --dry-run] [--append]`
 *
 * Additive-only. Creates generated tasks + comments inside ONE existing
 * company. Never creates/modifies Company/User/Team/Project/Label records.
 */
import { PrismaClient } from "@prisma/client";
import { resolveConfig } from "./demo/config";
import { loadCompanyContext } from "./demo/context";
import { createRng } from "./demo/random";
import { generateTasks } from "./demo/generators/tasks";
import { generateComments } from "./demo/generators/comments";
import {
  insertDataset,
  manifestExists,
  validateDataset,
  writeManifest,
} from "./demo/seed";
import { printSummary, smokeCheck, summarize } from "./demo/verify";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const append = args.includes("--append");
  const now = new Date();

  const cfg = resolveConfig(process.env);
  console.log(
    `Target company: ${cfg.companyId} | seed: ${cfg.seed} | tasks: ${cfg.taskCount}${dryRun ? " | DRY RUN (no writes)" : ""}`
  );

  const ctx = await loadCompanyContext(prisma, cfg.companyId);
  console.log(
    `Company: ${ctx.companyName} | users: ${ctx.users.length} | teams: ${ctx.teams.length} | projects: ${ctx.projects.length} | labels: ${ctx.labels.length}`
  );

  if (!dryRun && (await manifestExists(cfg.companyId)) && !append) {
    throw new Error(
      `A demo manifest already exists for company ${cfg.companyId}. ` +
        `Refusing to run to avoid duplicate data. Pass --append to intentionally generate another batch.`
    );
  }

  const rng = createRng(`${cfg.seed}:${cfg.companyId}`);
  const tasks = generateTasks(rng, cfg, ctx, now);
  const comments = generateComments(rng, cfg, ctx, tasks, now);

  validateDataset(ctx, tasks, comments);
  console.log(
    `Validated ${tasks.length} tasks + ${comments.length} comments against company ${cfg.companyId}.`
  );

  const summary = summarize(tasks, comments, now);
  const issues = smokeCheck(summary);
  if (issues.length > 0) {
    throw new Error(
      `Analytics smoke check failed:\n- ${issues.join("\n- ")}`
    );
  }

  if (dryRun) {
    printSummary(ctx.companyName, cfg.seed, String(cfg.taskCount), summary, {
      users: ctx.users.length,
      teams: ctx.teams.length,
      projects: ctx.projects.length,
    });
    console.log("Dry run complete. No database writes performed.");
    return;
  }

  await insertDataset(prisma, tasks, comments);

  const manifestPath = await writeManifest({
    companyId: cfg.companyId,
    seed: cfg.seed,
    preset: String(cfg.taskCount),
    taskCount: tasks.length,
    generatedAt: now.toISOString(),
    taskIds: tasks.map((t) => t.id),
    commentIds: comments.map((c) => c.id as string),
  });

  printSummary(ctx.companyName, cfg.seed, String(cfg.taskCount), summary, {
    users: ctx.users.length,
    teams: ctx.teams.length,
    projects: ctx.projects.length,
    manifest: manifestPath,
  });
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
