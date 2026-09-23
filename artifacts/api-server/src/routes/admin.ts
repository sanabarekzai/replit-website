import { Router, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  CreateContactSubmissionResponse,
  GetAdminMessagesResponse,
  GetAdminSummaryResponse,
  MarkAdminMessageRepliedParams,
} from "@workspace/api-zod";
import {
  listContactSubmissions,
  updateContactSubmissions,
} from "../lib/contactStorage";
import {
  hasAdminSession,
  passwordMatches,
  setAdminSession,
} from "../lib/adminAuth";

const router: IRouter = Router();
const reasons = ["Comment", "Question", "Partnership", "Opportunity", "Other"] as const;

function requireAdmin(req: Parameters<Parameters<IRouter["get"]>[1]>[0], res: Parameters<Parameters<IRouter["get"]>[1]>[1]) {
  if (!hasAdminSession(req)) {
    res.status(401).json({ error: "Admin authentication required." });
    return false;
  }
  return true;
}

router.post("/admin/login", (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success || !passwordMatches(parsed.data.password)) {
    res.status(401).json({ error: "Incorrect admin password." });
    return;
  }

  setAdminSession(res);
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.get("/admin/messages", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const records = (await listContactSubmissions()).sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
    res.json(GetAdminMessagesResponse.parse(records));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load contact submissions");
    res.status(500).json({ error: "Unable to load contact messages." });
  }
});

router.get("/admin/summary", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const records = await listContactSubmissions();
    const repliedMessages = records.filter((record) => record.replied).length;
    const byReason = reasons.map((reason) => ({
      reason,
      count: records.filter((record) => record.reason === reason).length,
    }));
    const summary = {
      totalMessages: records.length,
      newMessages: records.length - repliedMessages,
      repliedMessages,
      replyRate:
        records.length === 0
          ? 0
          : Math.round((repliedMessages / records.length) * 1000) / 10,
      byReason,
    };
    res.json(GetAdminSummaryResponse.parse(summary));
  } catch (error) {
    req.log.error({ err: error }, "Failed to load contact summary");
    res.status(500).json({ error: "Unable to load dashboard summary." });
  }
});

router.patch("/admin/messages/:id/replied", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const parsed = MarkAdminMessageRepliedParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "A valid message id is required." });
    return;
  }

  try {
    let updated: ReturnType<typeof CreateContactSubmissionResponse.parse> | undefined;
    await updateContactSubmissions((records) =>
      records.map((record) => {
        if (record.id !== parsed.data.id) return record;
        updated = CreateContactSubmissionResponse.parse({
          ...record,
          replied: true,
          repliedAt: new Date().toISOString(),
        });
        return updated;
      }),
    );

    if (!updated) {
      res.status(404).json({ error: "Contact message not found." });
      return;
    }
    res.json(updated);
  } catch (error) {
    req.log.error({ err: error }, "Failed to mark message as replied");
    res.status(500).json({ error: "Unable to update this message." });
  }
});

export default router;