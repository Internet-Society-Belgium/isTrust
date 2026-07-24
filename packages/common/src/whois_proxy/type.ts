import { z } from "zod/mini";
import { source_error } from "../utils/error";

const whoisProxySchema = z.array(z.object({ pattern: z.array(z.string()) }));

export function validate_whois_proxy(json: unknown) {
  const whoisProxy = whoisProxySchema.safeParse(json);
  if (!whoisProxy.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(whoisProxy.error)}`,
    );
  }
  return whoisProxy.data;
}

const whoisProxyPatternsSchema = z.array(z.string());

export type WhoisProxyPatterns = z.infer<typeof whoisProxyPatternsSchema>;

export function validate_whois_proxy_patterns(json: unknown) {
  const whoisProxyPatterns = whoisProxyPatternsSchema.safeParse(json);
  if (!whoisProxyPatterns.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(whoisProxyPatterns.error)}`,
    );
  }
  return whoisProxyPatterns.data;
}
