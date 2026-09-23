import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import {
  CreateContactSubmissionBody,
  CreateContactSubmissionResponse,
} from "@workspace/api-zod";
import { appendContactSubmission } from "../lib/contactStorage";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please complete every required field." });
    return;
  }

  const submission = CreateContactSubmissionResponse.parse({
    id: crypto.randomUUID(),
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    replied: false,
    repliedAt: null,
  });

  try {
    const saved = await appendContactSubmission(submission);
    res.status(201).json(CreateContactSubmissionResponse.parse(saved));
  } catch (error) {
    req.log.error({ err: error }, "Failed to save contact submission");
    res.status(500).json({ error: "Unable to save your message right now." });
  }
});

export default router;