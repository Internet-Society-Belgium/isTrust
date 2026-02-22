import * as dnsPacket from "@dnsquery/dns-packet";
import { DOH_RESOLVERS } from "./resolvers";
import { DNSSECData } from "./type";

export async function get_data(domain: string, canBypassCORS: boolean) {
  const data: DNSSECData = {};

  const resolvers = DOH_RESOLVERS.filter(({ protectedByCORS }) =>
    canBypassCORS ? true : !protectedByCORS,
  )
    .map((value) => ({
      value,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (const resolver of resolvers) {
    try {
      // https://learn.microsoft.com/en-us/windows-server/networking/dns/validate-dnssec-responses
      const queryPacket = dnsPacket.encode({
        type: "query",
        id: Math.floor(Math.random() * 65534),
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [{ type: "A", name: domain }],
        additionals: [
          {
            type: "OPT",
            name: ".",
            // @ts-expect-error https://github.com/dnsquery/dns-packet/issues/1
            flags: dnsPacket.DNSSEC_OK,
          },
        ],
      });

      const res = await fetch(resolver.endpoint, {
        method: "POST",
        headers: { "content-type": "application/dns-message" },
        // @ts-expect-error https://github.com/whatwg/fetch/issues/1732
        body: queryPacket,
      });

      const responseBytes = new Uint8Array(await res.arrayBuffer());
      const responseData = dnsPacket.decode(responseBytes);

      // https://datatracker.ietf.org/doc/rfc3655/
      const validity = responseData.flag_ad === true;

      data.valid = {
        value: validity,
        sources: [
          {
            organization: resolver.name,
            links: resolver.links,
            country: resolver.country,
          },
        ],
      };

      return data;
    } catch (e) {
      const error = e as Error;
      console.error(`${error.message} from ${resolver.name}`);
    }
  }
}
