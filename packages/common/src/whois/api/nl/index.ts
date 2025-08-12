import { Source } from "../../../type";
import { source_error } from "../../../utils/error";
import { WHOISData } from "../../type";
import { validate_whois } from "./type";

export async function get_data(domain: string) {
  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };

  const sources: Source[] = [
    {
      organization: "SIDN BV",
      country: "NL",
      links: ["https://www.sidn.nl/"],
    },
  ];

  try {
    const res = await fetch(`https://api.sidn.nl/rest/whois?domain=${domain}`);

    if (!res.ok) throw source_error("No registration response");

    const json: unknown = await res.json();

    const whois = validate_whois(json);

    const registrationDate = new Date(whois.details.creationDate).setUTCHours(
      0,
      0,
      0,
      0,
    );

    data.registrations = [
      {
        value: new Date(registrationDate).toISOString(),
        sources,
        verified: true,
      },
    ];

    data.organizations = [
      { value: whois.details.registrant, sources, verified: false },
    ];
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from SIDN`);
  }

  return data;
}
