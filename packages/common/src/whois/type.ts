import { z } from "zod";

// https://datatracker.ietf.org/doc/rfc9224/
const BootstrapSchema = z.object({
  services: z.array(z.array(z.array(z.string()))),
});

export function validateBootstrap(json: unknown) {
  const bootstrap = BootstrapSchema.safeParse(json);
  if (!bootstrap.success) throw new Error("Invalid RDAP bootstrap file");
  return bootstrap.data;
}

// https://datatracker.ietf.org/doc/rfc7095/
// https://datatracker.ietf.org/doc/rfc6350/
const jCardSchema = z.tuple([
  z.literal("vcard"),
  z
    .array(
      z.tuple([
        z.string().describe("Name"),
        z.record(z.string(), z.string().optional()).describe("Parameters"),
        z.string().describe("Type"),
        z.union([z.string(), z.array(z.string())]).describe("Values"),
      ]),
    )
    .describe("Properties"),
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
      vcardArray: jCardSchema.optional(),
      roles: z.array(z.string()),
      objectClassName: z.string(),
    }),
  ),
  secureDNS: z
    .object({
      delegationSigned: z.boolean(),
    })
    .optional(),
  links: z.array(
    z.object({
      rel: z.string(),
      href: z.string(),
      type: z.string(),
    }),
  ),
});

export type RdapResult = z.infer<typeof RdapResultSchema>;

export function validateRdapResult(json: unknown) {
  const rdapResult = RdapResultSchema.safeParse(json);
  if (!rdapResult.success) throw new Error("Invalid RDAP results");
  return rdapResult.data;
}

export interface WHOISData {
  domain: string;
  registration?: Date;
  registrant?: {
    individual?: string;
    organization?: string;
    country?: string;
  };
  dnssec?: boolean;
}
