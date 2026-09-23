import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { feedbackPrefix, feedbackRequest, feedbackTargets, type FeedbackTarget } from "./site-feedback";
import { r2Config } from "./r2";

export type FeedbackSummary = {
  total: number;
  limited: boolean;
  rows: { target: FeedbackTarget; label: string; model: string; counts: Record<string, number>; total: number }[];
};

export async function readSiteFeedback(days = 30): Promise<FeedbackSummary> {
  const { client, bucket } = r2Config();
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const keys: string[] = [];
  let continuation: string | undefined;
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: bucket, Prefix: feedbackPrefix,
      ...(continuation ? { ContinuationToken: continuation } : { StartAfter: `${feedbackPrefix}${since}` }),
      MaxKeys: 1000,
    }));
    keys.push(...(page.Contents ?? []).flatMap(item => item.Key ? [item.Key] : []));
    continuation = page.NextContinuationToken;
  } while (continuation && keys.length < 5000);

  const grouped = new Map<string, FeedbackSummary["rows"][number]>();
  let total = 0;
  for (let offset = 0; offset < keys.length; offset += 12) {
    const batch = await Promise.allSettled(keys.slice(offset, offset + 12).map(async key => {
      const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      return JSON.parse(await object.Body!.transformToString()) as unknown;
    }));
    for (const result of batch) {
      if (result.status !== "fulfilled" || !result.value || typeof result.value !== "object") continue;
      const value = result.value as Record<string, unknown>;
      const parsed = feedbackRequest.safeParse({ target: value.target, choice: value.choice, trap: "" });
      if (!parsed.success || typeof value.model !== "string" || value.model.length > 40) continue;
      const { target, choice } = parsed.data;
      const groupKey = `${target}\0${value.model}`;
      const row = grouped.get(groupKey) ?? { target, label: feedbackTargets[target].label, model: value.model, counts: {}, total: 0 };
      row.counts[choice] = (row.counts[choice] ?? 0) + 1;
      row.total++;
      total++;
      grouped.set(groupKey, row);
    }
  }
  return {
    total, limited: Boolean(continuation),
    rows: [...grouped.values()].sort((a, b) => b.total - a.total || a.label.localeCompare(b.label)),
  };
}
