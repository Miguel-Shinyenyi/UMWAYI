import test from "node:test";
import assert from "node:assert/strict";
import { parseQueue, serializeQueue, contentHash, effectiveStatus, QueueError } from "../social/lib/queue.mjs";

const base = { id: "a-1", platform: "threads", kind: "post", status: "drafted" };
const line = (o) => JSON.stringify({ ...base, ...o });

test("a valid line parses and fills defaults", () => {
  const [it] = parseQueue(line({ title: "T" }) + "\n");
  assert.equal(it.id, "a-1");
  assert.equal(it.ai_assisted, "unknown");
  assert.deepEqual(it.media, []);
  assert.equal(it.link, null);
});

test("blank lines are ignored", () => {
  assert.equal(parseQueue("\n" + line({}) + "\n\n").length, 1);
});

test("an unknown field is refused", () => {
  assert.throws(() => parseQueue(line({ mood: "good" })), QueueError);
});

test("an unknown status is refused", () => {
  assert.throws(() => parseQueue(line({ status: "scheduled" })), /unknown status/);
});

test("an unknown kind, bad id, bad platform and bad ai_assisted are refused", () => {
  assert.throws(() => parseQueue(line({ kind: "story" })), /unknown kind/);
  assert.throws(() => parseQueue(line({ id: "Bad Id" })), /bad id/);
  assert.throws(() => parseQueue(line({ platform: "Threads!" })), /bad platform/);
  assert.throws(() => parseQueue(line({ ai_assisted: "maybe" })), /ai_assisted/);
});

test("wrong types and bad dates are refused", () => {
  assert.throws(() => parseQueue(line({ title: 5 })), /title must be text/);
  assert.throws(() => parseQueue(line({ media: "a.mp4" })), /media/);
  assert.throws(() => parseQueue(line({ earliest_date: "2026-02-31" })), /real YYYY-MM-DD/);
  assert.throws(() => parseQueue(line({ earliest_date: "soon" })), /real YYYY-MM-DD/);
  assert.throws(() => parseQueue(line({ approved_sha256: "abc" })), /64 hex/);
});

test("not JSON, not an object, and duplicate ids are refused", () => {
  assert.throws(() => parseQueue("{nope"), /not valid JSON/);
  assert.throws(() => parseQueue("[1]"), /not an object/);
  assert.throws(() => parseQueue(line({}) + "\n" + line({})), /duplicate id/);
});

test("approved needs a hash and posted needs a URL", () => {
  assert.throws(() => parseQueue(line({ status: "approved" })), /approved needs/);
  assert.throws(() => parseQueue(line({ status: "posted" })), /posted needs/);
});

test("serialize then parse gives the same items", () => {
  const items = parseQueue(line({ title: "T", media: ["media/a.mp4"], link: "https://example.com" }));
  assert.deepEqual(parseQueue(serializeQueue(items)), items);
});

test("the hash changes when the body, title or link changes", () => {
  const h = (o) => contentHash({ title: "t", link: "https://x.y", body: "b", ...o });
  assert.equal(h({}), h({}));
  assert.notEqual(h({}), h({ body: "b " }));
  assert.notEqual(h({}), h({ title: "T" }));
  assert.notEqual(h({}), h({ link: "https://x.z" }));
});

test("an approved item with a changed hash is drafted again", () => {
  const it = { status: "approved", approved_sha256: "a".repeat(64) };
  assert.equal(effectiveStatus(it, "a".repeat(64)), "approved");
  assert.equal(effectiveStatus(it, "b".repeat(64)), "drafted");
  assert.equal(effectiveStatus({ status: "linted" }, "x"), "linted");
});
