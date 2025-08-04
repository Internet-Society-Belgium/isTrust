import { z } from "zod/mini";
import { source_error } from "../../utils/error";

// https://sslmate.com/help/reference/ct_search_api_v1#api_issuance
const sslMateSearchSchema = z.object({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  dns_names: z.array(z.string()),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  not_before: z.string(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  not_after: z.string(),
  revoked: z.nullable(z.boolean()),
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
