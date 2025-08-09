import { z } from "zod/mini";
import { source_error } from "../../utils/error";

// https://sslmate.com/help/reference/ct_search_api_v1#api_issuance
const sslMateSearchSchema = z.object({
  dns_names: z.array(z.string()),
  not_before: z.iso.datetime(),
  not_after: z.iso.datetime(),
  revoked: z.nullable(z.boolean()),
  cert_der: z.string(),
});
const sslMateSearchListSchema = z.array(sslMateSearchSchema);

export type SSLMateSearch = z.infer<typeof sslMateSearchSchema>;

export function validate_sslmate_search(json: unknown) {
  const sslMateResults = sslMateSearchListSchema.safeParse(json);
  if (!sslMateResults.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(sslMateResults.error)}`,
    );
  }
  return sslMateResults.data;
}
