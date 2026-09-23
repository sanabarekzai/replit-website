import { Storage } from "@google-cloud/storage";
import { CreateContactSubmissionResponse } from "@workspace/api-zod";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});
const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
const filePath = "data/contactReceived.json";

if (!bucketId) {
  throw new Error(
    "DEFAULT_OBJECT_STORAGE_BUCKET_ID must be set for contact storage.",
  );
}

const contactFile = storage.bucket(bucketId).file(filePath);
let storageQueue: Promise<unknown> = Promise.resolve();

function withStorageLock<T>(operation: () => Promise<T>): Promise<T> {
  const next = storageQueue.then(operation, operation);
  storageQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function readContactFile(): Promise<unknown[]> {
  try {
    const [contents] = await contactFile.download();
    const parsed: unknown = JSON.parse(contents.toString("utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error("Contact storage must contain a JSON array.");
    }
    return parsed;
  } catch (error) {
    const storageError = error as { code?: number };
    if (storageError.code !== 404) {
      throw error;
    }

    await contactFile.save("[]", {
      contentType: "application/json",
      resumable: false,
      metadata: { cacheControl: "no-store" },
    });
    return [];
  }
}

export async function listContactSubmissions() {
  const records = await readContactFile();
  return records.map((record) => CreateContactSubmissionResponse.parse(record));
}

export async function appendContactSubmission(
  submission: ReturnType<typeof CreateContactSubmissionResponse.parse>,
) {
  return withStorageLock(async () => {
    const records = await listContactSubmissions();
    records.push(submission);
    await contactFile.save(JSON.stringify(records, null, 2), {
      contentType: "application/json",
      resumable: false,
      metadata: { cacheControl: "no-store" },
    });
    return submission;
  });
}

export async function updateContactSubmissions(
  update: (
    submissions: ReturnType<typeof CreateContactSubmissionResponse.parse>[],
  ) => ReturnType<typeof CreateContactSubmissionResponse.parse>[],
) {
  return withStorageLock(async () => {
    const records = update(await listContactSubmissions());
    await contactFile.save(JSON.stringify(records, null, 2), {
      contentType: "application/json",
      resumable: false,
      metadata: { cacheControl: "no-store" },
    });
    return records;
  });
}