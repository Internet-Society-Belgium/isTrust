/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod/mini";
import { Data } from "../type";
import { source_error } from "../utils/error";

// https://datatracker.ietf.org/doc/rfc9224/
const BootstrapSchema = z.object({
  services: z.array(z.array(z.array(z.string()))),
});

export function validate_bootstrap(json: unknown) {
  const bootstrap = BootstrapSchema.safeParse(json);
  if (!bootstrap.success)
    throw source_error(
      `Invalid RDAP bootstrap:\n${z.prettifyError(bootstrap.error)}`,
    );
  return bootstrap.data;
}

const rdapValueSchema = z.union([
  z.string(),
  z.array(z.union([z.string(), z.array(z.string())])),
]);

type RdapValue = z.infer<typeof rdapValueSchema>;

export function stringify_rdap_value(value: RdapValue) {
  let rdapValueString = "";

  if (Array.isArray(value)) {
    rdapValueString = value.map((v) => stringify_rdap_value(v)).join(" ");
  } else {
    rdapValueString = value;
  }

  rdapValueString = rdapValueString.trim();
  if (rdapValueString === "") return null;

  return rdapValueString;
}

// https://datatracker.ietf.org/doc/rfc7095/
// https://datatracker.ietf.org/doc/rfc6350/
const jCardSchema = z.tuple([
  z.literal("vcard"),
  // Properties
  z.array(
    z.tuple([
      // Name
      z.string(),
      // Parameters
      z.record(
        z.string(),
        z.optional(z.union([z.string(), z.array(z.string())])),
      ),
      // Type
      z.string(),
      // Values
      rdapValueSchema,
    ]),
  ),
]);

export type JCard = z.infer<typeof jCardSchema>;

// https://www.rfc-editor.org/rfc/rfc7483.html#section-4.2
const LinkSchema = z.object({
  href: z.string(),
  rel: z.optional(z.string()),
  type: z.optional(z.string()),
});

// https://datatracker.ietf.org/doc/rfc7483/
const RdapResultSchema = z.object({
  events: z.array(
    z.object({
      eventAction: z.string(),
      eventDate: z.string(),
    }),
  ),
  entities: z.array(
    z.object({
      vcardArray: z.optional(jCardSchema),
      roles: z.array(z.string()),
      objectClassName: z.string(),
      links: z.optional(z.array(LinkSchema)),
    }),
  ),
  secureDNS: z.optional(
    z.object({
      delegationSigned: z.boolean(),
    }),
  ),
  links: z.array(LinkSchema),
});

export type RdapResult = z.infer<typeof RdapResultSchema>;

export function validateRdapResult(json: unknown) {
  const rdapResult = RdapResultSchema.safeParse(json);
  if (!rdapResult.success)
    throw source_error(
      `Invalid RDAP results:\n${z.prettifyError(rdapResult.error)}`,
    );
  return rdapResult.data;
}

export interface WHOISData {
  registrations: Data<string>[] | null;
  expirations: Data<string>[] | null;
  organizations: Data<string>[] | null;
  individuals: Data<string>[] | null;
  countries: Data<string>[] | null;
}
