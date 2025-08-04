/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod/mini";
import { source_error } from "../../utils/error";

// https://sslmate.com/help/reference/ct_search_api_v1#api_issuance
const SSLMateSearchSchema = z.object({
  dns_names: z.array(z.string()),
  not_before: z.string(),
  not_after: z.string(),
  revoked: z.nullable(z.boolean()),
  cert_der: z.string(),
});
const SSLMateSearchListSchema = z.array(SSLMateSearchSchema);

export type SSLMateSearch = z.infer<typeof SSLMateSearchSchema>;

export function validateSSLMateSearch(json: unknown) {
  const sslMateResults = SSLMateSearchListSchema.safeParse(json);
  if (!sslMateResults.success)
    throw source_error(
      `Invalid SSLMate response (${sslMateResults.error.message})`,
    );
  return sslMateResults.data;
}
