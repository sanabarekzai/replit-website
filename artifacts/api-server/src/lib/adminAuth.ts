import crypto from "node:crypto";
import type { Request, Response } from "express";

const cookieName = "admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD ?? process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD or SESSION_SECRET must be configured.");
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function passwordMatches(password: string) {
  const expected = getSecret();
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  return (
    passwordBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, expectedBuffer)
  );
}

export function setAdminSession(res: Response) {
  const issuedAt = Date.now().toString();
  res.cookie(cookieName, `${issuedAt}.${sign(issuedAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionDurationMs,
    path: "/",
  });
}

export function hasAdminSession(req: Request) {
  const raw = req.cookies?.[cookieName];
  if (typeof raw !== "string") {
    return false;
  }

  const [issuedAt, signature] = raw.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) {
    return false;
  }

  const issuedAtNumber = Number(issuedAt);
  if (
    !Number.isSafeInteger(issuedAtNumber) ||
    Date.now() - issuedAtNumber > sessionDurationMs ||
    Date.now() - issuedAtNumber < 0
  ) {
    return false;
  }

  const expected = Buffer.from(sign(issuedAt));
  const received = Buffer.from(signature);
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}