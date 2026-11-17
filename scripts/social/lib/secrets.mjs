// Secrets are read at the moment of use and never stored, printed or logged.
// Order: environment variable SOCIAL_SECRET_<NAME>, then the macOS Keychain
// (service "umwayi-social", account <NAME>). The owner puts them there himself.
import { execFileSync } from "node:child_process";

const NAME_RE = /^[A-Z][A-Z0-9_]{1,40}$/;

export function makeSecretReader({ env = process.env, exec = execFileSync } = {}) {
  return function readSecret(name) {
    if (!NAME_RE.test(name)) throw new Error(`bad secret name ${name}`);
    const fromEnv = env[`SOCIAL_SECRET_${name}`];
    if (fromEnv) return fromEnv;
    try {
      const out = exec("security", ["find-generic-password", "-s", "umwayi-social", "-a", name, "-w"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 5000,
      });
      const v = String(out).trim();
      return v || null;
    } catch {
      return null;
    }
  };
}

// Remove every known secret value from a string before it is shown.
export function redact(text, secrets) {
  let out = String(text);
  for (const s of secrets) {
    if (s && s.length >= 4) out = out.split(s).join("[redacted]");
  }
  return out;
}
