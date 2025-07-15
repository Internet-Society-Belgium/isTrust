import { z } from "zod/mini";

// https://sslmate.com/help/reference/ct_search_api_v1#api_issuance
const SSLMateSearchSchema = z.object({
  dns_names: z.array(z.string()),
  not_before: z.string(),
  not_after: z.string(),
  revoked: z.optional(z.boolean()),
  cert_der: z.string(),
});
const SSLMateSearchListSchema = z.array(SSLMateSearchSchema);

export type SSLMateSearch = z.infer<typeof SSLMateSearchSchema>;

export function validateSSLMateSearch(json: unknown) {
  const sslMateResults = SSLMateSearchListSchema.safeParse(json);
  if (!sslMateResults.success) throw new Error("Invalid SSLMate response");
  return sslMateResults.data;
}
