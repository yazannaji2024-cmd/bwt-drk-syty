import { Router, type IRouter } from "express";
import { violationsStore, warningsStore, autoRepliesStore, afkStore, prisonStore } from "../bot/data/store";
import { botClient } from "../bot/index";

const router: IRouter = Router();

router.get("/stats", (_req, res) => {
  let totalViolations = 0;
  let unpaidViolations = 0;
  let totalRevenue = 0;

  for (const violations of violationsStore.values()) {
    totalViolations += violations.length;
    for (const v of violations) {
      if (!v.paid) unpaidViolations++;
      if (v.paid) totalRevenue += v.price;
    }
  }

  let totalWarnings = 0;
  for (const warns of warningsStore.values()) {
    totalWarnings += warns.length;
  }

  let totalAutoReplies = 0;
  for (const rules of autoRepliesStore.values()) {
    totalAutoReplies += rules.length;
  }

  const stats = {
    bot: {
      online: botClient !== null,
      tag: botClient?.user?.tag ?? null,
      guilds: botClient?.guilds.cache.size ?? 0,
    },
    violations: {
      total: totalViolations,
      unpaid: unpaidViolations,
      paid: totalViolations - unpaidViolations,
      revenue: totalRevenue,
    },
    warnings: { total: totalWarnings },
    autoReplies: { total: totalAutoReplies },
    afk: { active: afkStore.size },
    prison: { active: prisonStore.size },
  };

  res.json(stats);
});

router.get("/violations", (_req, res) => {
  const result: Array<{ guildId: string; violations: unknown[] }> = [];
  for (const [guildId, violations] of violationsStore.entries()) {
    result.push({ guildId, violations: violations.slice(-20).reverse() });
  }
  res.json(result);
});

export default router;
