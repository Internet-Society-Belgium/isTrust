import { z } from "zod/mini";
import { Information } from "../type";
import { source_error } from "../utils/error";

export interface DNSSECData {
  valid?: Information<boolean>;
}

const dnsResponseSchema = z.object({
  AD: z.boolean(),
});

export function validate_dns_response(json: unknown) {
  const dnsResponse = dnsResponseSchema.safeParse(json);
  if (!dnsResponse.success)
    throw source_error(
      `Invalid DNS response format:\n${z.prettifyError(dnsResponse.error)}`,
    );
  return dnsResponse.data;
}
