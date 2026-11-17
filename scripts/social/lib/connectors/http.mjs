// One small HTTP helper for every connector. HTTPS only, a timeout, no redirects,
// and any error text has the secrets removed before it leaves this file.
import { redact } from "../secrets.mjs";

export class ConnectorError extends Error {}

export async function request(fetchFn, url, { method = "POST", headers = {}, json, form, secrets = [], timeoutMs = 15000, allowEmpty = false } = {}) {
  if (!/^https:\/\/[^\s/]+\//.test(url)) throw new ConnectorError("refusing a request that is not https");
  const h = { ...headers };
  let body;
  if (json !== undefined) {
    h["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form !== undefined) {
    h["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(form).toString();
  }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  let res;
  try {
    res = await fetchFn(url, { method, headers: h, body, redirect: "error", signal: ctl.signal });
  } catch (e) {
    throw new ConnectorError(redact(`request failed (${e?.name ?? "error"})`, secrets));
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  if (!res.ok) {
    throw new ConnectorError(redact(`HTTP ${res.status}: ${text.slice(0, 300)}`, secrets));
  }
  if (allowEmpty && text.trim() === "") {
    const h = {};
    for (const [k, v] of res.headers?.entries?.() ?? []) h[k.toLowerCase()] = v;
    return { _headers: h };
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new ConnectorError("the reply was not JSON");
  }
}

export function checkHttpsHost(value, label) {
  let u;
  try {
    u = new URL(value);
  } catch {
    throw new ConnectorError(`${label} is not a URL`);
  }
  if (u.protocol !== "https:" || u.username || u.password || u.port || (u.pathname !== "/" && u.pathname !== "")) {
    throw new ConnectorError(`${label} must be a plain https host, for example https://example.social`);
  }
  return u.origin;
}
