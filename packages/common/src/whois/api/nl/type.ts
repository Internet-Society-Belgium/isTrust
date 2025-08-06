import { z } from "zod/mini";
import { source_error } from "../../../utils/error";

const whoisSchema = z.object({
  details: z.object({
    creationDate: z.string(),
    registrant: z.string(),
  }),
});

export function validate_whois(json: unknown) {
  const whois = whoisSchema.safeParse(json);
  if (!whois.success)
    throw source_error(`Invalid format:\n${z.prettifyError(whois.error)}`);
  return whois.data;
}
