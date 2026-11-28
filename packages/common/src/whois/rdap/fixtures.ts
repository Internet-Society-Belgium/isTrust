// Registrant entities trimmed from registrar-side RDAP responses to the vCard
// fields the parser reads. CC_REDACTED and LABEL_UNITED_STATES are synthetic.
type Property = [string, Record<string, string>, string, string | string[]];

const fn = (value: string): Property => ["fn", {}, "text", value];
const org = (value: string): Property => ["org", {}, "text", value];
// RFC 6350 adr: the country name is the 7th component.
const adr = (parameters: Record<string, string>, country = ""): Property => [
  "adr",
  parameters,
  "text",
  ["", "", "", "", "", "", country],
];

const entity = (role: string, properties: Property[]) => ({
  objectClassName: "entity",
  roles: [role],
  vcardArray: ["vcard", properties],
});

const result = (registrar: string, ...registrant: Property[]) => ({
  events: [],
  entities: [
    entity("registrar", [fn(registrar)]),
    entity("registrant", registrant),
  ],
});

export const NAMECHEAP = result(
  "NAMECHEAP INC",
  fn(""),
  org("Privacy service provided by WITHHELD FOR PRIVACY LLC"),
  adr({ cc: "US" }),
);

export const BANKOFAMERICA = result(
  "CSC Corporate Domains, Inc.",
  fn(""),
  org("Bank of America Corporation"),
  adr({ cc: "US" }),
);

export const ISTRUST = result(
  "Gandi SAS",
  fn("Redacted for Privacy"),
  org("Internet Society Chapter Belgium vzw/asbl"),
  adr({ cc: "BE" }),
);

// The registrant has no name or organization, only a country.
export const GITHUB = result("Markmonitor Inc.", fn(""), adr({ cc: "US" }));

export const CC_REDACTED = result(
  "Example Registrar",
  org("Bank of America Corporation"),
  adr({ cc: "REDACTED" }),
);

export const LABEL_UNITED_STATES = result(
  "Example Registrar",
  org("Bank of America Corporation"),
  adr({}, "United States"),
);
