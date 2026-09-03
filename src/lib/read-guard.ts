import lists from "../../blacklist.json";

const normalize = (host: string): string => host.trim().toLowerCase().replace(/^www\./, "");

const WHITELIST: string[] = (lists.whitelist as string[]).map(normalize).filter(Boolean);
const BLACKLIST: string[] = (lists.blacklist as string[]).map(normalize).filter(Boolean);

function matches(host: string, entry: string): boolean {
  return host === entry || host.endsWith("." + entry);
}

export type ReadDecision = { allowed: true } | { allowed: false; reason: string };

/**
 * Domain policy for /read:
 * - whitelist non-empty  -> only whitelisted domains (and subdomains) are allowed
 * - whitelist empty      -> everything except blacklisted domains is allowed
 */
export function checkReadTarget(hostname: string): ReadDecision {
  const host = normalize(hostname);
  if (WHITELIST.length > 0) {
    return WHITELIST.some((e) => matches(host, e))
      ? { allowed: true }
      : { allowed: false, reason: "blacklisted" };
  }
  return BLACKLIST.some((e) => matches(host, e))
    ? { allowed: false, reason: "blacklisted" }
    : { allowed: true };
}
