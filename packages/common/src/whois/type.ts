import { z } from "zod/mini";

// https://datatracker.ietf.org/doc/rfc9224/
const BootstrapSchema = z.object({
  services: z.array(z.array(z.array(z.string()))),
});

export function validateBootstrap(json: unknown) {
  const bootstrap = BootstrapSchema.safeParse(json);
  if (!bootstrap.success) throw new Error("Invalid RDAP bootstrap file format");
  return bootstrap.data;
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
      z.union([
        z.string(),
        z.array(z.union([z.string(), z.array(z.string())])),
      ]),
    ]),
  ),
]);

// https://datatracker.ietf.org/doc/rfc7483/
const RdapResultSchema = z.object({
  ldhName: z.string(),
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
    }),
  ),
  secureDNS: z.optional(
    z.object({
      delegationSigned: z.boolean(),
    }),
  ),
  links: z.array(
    z.object({
      href: z.string(),
      rel: z.optional(z.string()),
      type: z.optional(z.string()),
    }),
  ),
});

export type RdapResult = z.infer<typeof RdapResultSchema>;

export function validateRdapResult(json: unknown) {
  const rdapResult = RdapResultSchema.safeParse(json);
  if (!rdapResult.success) throw new Error("Invalid RDAP results format");
  return rdapResult.data;
}

export interface WHOISData {
  registration?: string;
  registrant?: {
    organization?: string;
    country?: {
      code?: string;
      name?: string;
    };
  };
  dnssecPresent?: boolean;
}
