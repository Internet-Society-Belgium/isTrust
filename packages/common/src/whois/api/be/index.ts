import { Source } from "../../../type";
import { source_error } from "../../../utils/error";
import { WHOISData } from "../../type";
import { validate_contact, validate_registration } from "./type";

export async function get_data(domain: string) {
  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };

  const sources: Source[] = [
    {
      organization: "DNS Belgium",
      country: "BE",
      links: ["https://www.dnsbelgium.be/"],
    },
  ];

  try {
    const resRegistration = await fetch(
      `https://api.dnsbelgium.be/whois/registration/${domain}`,
    );

    if (!resRegistration.ok) throw source_error("No registration response");

    const jsonRegistration: unknown = await resRegistration.json();

    const registration = validate_registration(jsonRegistration);

    data.registrations = [
      {
        value: new Date(registration.domainInfo.created).toISOString(),
        sources,
      },
    ];

    const resContact = await fetch(
      `https://api.dnsbelgium.be/whois/contact/${registration.registrant}`,
    );

    if (!resContact.ok) throw source_error("No contact response");

    const jsonContact: unknown = await resContact.json();

    const contact = validate_contact(jsonContact);

    let verified: boolean | undefined;
    if (contact.verificationStatus === "APPROVED") {
      verified = true;
    }

    if (contact.companyName !== null) {
      data.organizations = [{ value: contact.companyName, sources, verified }];
    }

    if (contact.country !== null) {
      data.countries = [{ value: contact.country, sources, verified }];
    }
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from DNS Belgium`);
  }

  return data;
}
