import test from "node:test";
import assert from "node:assert/strict";
import { seal, unseal } from "../lib/auth";
test("session encryption rejects tampering, wrong purpose, and expired tokens", async () => {
  const prior = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET =
    "test-only-secret-not-for-deployment-00000000000000";
  try {
    const encrypted = await seal(
      { token: "test-token", id: "123" },
      "admin",
      60,
    );
    assert.ok(!encrypted.includes("test-token"));
    assert.equal((await unseal(encrypted, "admin")).id, "123");
    const parts = encrypted.split(".");
    parts[3] = (parts[3][0] === "A" ? "B" : "A") + parts[3].slice(1);
    await assert.rejects(unseal(parts.join("."), "admin"));
    await assert.rejects(unseal(encrypted, "oauth"));
    const expired = await seal({ id: "123" }, "admin", 0);
    await assert.rejects(unseal(expired, "admin"));
  } finally {
    if (prior === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = prior;
  }
});
