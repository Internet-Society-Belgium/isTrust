// Entities trimmed from registrar-side RDAP responses (fetched with the
// registrar's RDAP server, not the registry's thin record). Only the vCard
// fields the parser reads are kept. Names, addresses and contact details of
// private persons are removed. The `synthetic` cases are not captured responses.
const registrar = (fn: string) => ({
  objectClassName: "entity",
  roles: ["registrar"],
  vcardArray: [
    "vcard",
    [
      ["version", {}, "text", "4.0"],
      ["fn", {}, "text", fn],
    ],
  ],
});

// namecheap.com: registrant hidden behind a privacy service in the US.
export const NAMECHEAP = {
  events: [],
  entities: [
    registrar("NAMECHEAP INC"),
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", ""],
          [
            "org",
            {},
            "text",
            "Privacy service provided by WITHHELD FOR PRIVACY LLC",
          ],
          [
            "adr",
            { cc: "US" },
            "text",
            ["", "", "16192 Coastal Highway", "Lewes", "Delaware", "19958", ""],
          ],
        ],
      ],
    },
  ],
};

// bankofamerica.com: owner in the US, not a privacy service.
export const BANKOFAMERICA = {
  events: [],
  entities: [
    registrar("CSC Corporate Domains, Inc."),
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", ""],
          ["org", {}, "text", "Bank of America Corporation"],
          ["adr", { cc: "US" }, "text", ["", "", "", "", "NC", "", ""]],
        ],
      ],
    },
  ],
};

// istrust.org: owner in Belgium, not a privacy service.
export const ISTRUST = {
  events: [],
  entities: [
    registrar("Gandi SAS"),
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", "Redacted for Privacy"],
          ["org", {}, "text", "Internet Society Chapter Belgium vzw/asbl"],
          ["adr", { cc: "BE" }, "text", ["", "", "", "", "", "", ""]],
        ],
      ],
    },
  ],
};

// github.com: registrant has no name or organization, only a country.
export const GITHUB = {
  events: [],
  entities: [
    {
      objectClassName: "entity",
      roles: ["registrar"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["org", { type: "work" }, "text", "Markmonitor Inc."],
          [
            "adr",
            { cc: "US" },
            "text",
            ["", "", "3540 E Longwing Ln", "Meridian", "ID", "83646", ""],
          ],
          ["fn", {}, "text", "Markmonitor Inc."],
        ],
      ],
    },
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", ""],
          ["adr", { cc: "US" }, "text", ["", "", "", "", "CA", "", ""]],
        ],
      ],
    },
  ],
};

// synthetic: cc is a placeholder, so the country is dropped.
export const CC_REDACTED = {
  events: [],
  entities: [
    registrar("Example Registrar"),
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["org", {}, "text", "Bank of America Corporation"],
          ["adr", { cc: "REDACTED" }, "text", ["", "", "", "", "", "", ""]],
        ],
      ],
    },
  ],
};

// synthetic: no cc, the country name is in the address label.
export const LABEL_UNITED_STATES = {
  events: [],
  entities: [
    registrar("Example Registrar"),
    {
      objectClassName: "entity",
      roles: ["registrant"],
      vcardArray: [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["org", {}, "text", "Bank of America Corporation"],
          ["adr", {}, "text", ["", "", "", "", "NC", "", "United States"]],
        ],
      ],
    },
  ],
};
