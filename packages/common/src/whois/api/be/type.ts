import { z } from "zod/mini";
import { source_error } from "../../../utils/error";

const registrationSchema = z.object({
  domainInfo: z.object({
    created: z.string(),
  }),
  registrant: z.string(),
});

export function validate_registration(json: unknown) {
  const registration = registrationSchema.safeParse(json);
  if (!registration.success)
    throw source_error(
      `Invalid registration format:\n${z.prettifyError(registration.error)}`,
    );
  return registration.data;
}

const contactSchema = z.object({
  companyName: z.nullable(z.string()),
  country: z.nullable(z.string()),
  verificationStatus: z.nullable(z.string()),
});

export function validate_contact(json: unknown) {
  const contact = contactSchema.safeParse(json);
  if (!contact.success)
    throw source_error(
      `Invalid contact format:\n${z.prettifyError(contact.error)}`,
    );
  return contact.data;
}
