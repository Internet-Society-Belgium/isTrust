import { Buffer as BufferPolyfill } from "buffer";
import dnsPacket from "dns-packet";
import { source_error } from "../utils/error";
import { DNSSECData } from "./type";

// declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

interface Resolver {
  url: string;
  name: string;
  country: string | null;
  links: string[];
}

const DEFAULT_RESOLVER: Resolver = {
  url: "https://cloudflare-dns.com/dns-query",
  name: "Cloudflare",
  country: "US",
  links: ["https://one.one.one.one/dns/"],
};

export async function get_data(domain: string, customResolver?: string) {
  let resolver: Resolver | undefined;

  if (customResolver !== undefined) {
    const hostname = new URL(customResolver).hostname;
    resolver = {
      name: hostname,
      url: customResolver,
      country: null,
      links: [customResolver.replace(/dns-query$/, "")],
    };
  } else {
    resolver = DEFAULT_RESOLVER;
  }

  const data: DNSSECData = {
    valid: null,
  };

  try {
    // https://www.rfc-editor.org/rfc/rfc1035.html
    const queryBuffer = dnsPacket.encode({
      type: "query",
      flags: dnsPacket.RECURSION_DESIRED | dnsPacket.AUTHENTIC_DATA,
      questions: [
        {
          type: "A",
          name: domain,
        },
      ],
    });

    const dnsQueryParam = queryBuffer.toString("base64").replace(/=/g, "");

    const res = await fetch(`${resolver.url}?dns=${dnsQueryParam}`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "application/dns-message",
      },
    });

    if (!res.ok) throw source_error("No DNS response");

    const resBuffer = await res.arrayBuffer();
    const decoded = dnsPacket.decode(Buffer.from(resBuffer));

    // https://datatracker.ietf.org/doc/rfc3655/
    const validity = decoded.flag_ad;

    data.valid = {
      value: validity,
      verification: {
        status: "verified",
        authorities: [
          {
            organization: resolver.name,
            links: resolver.links,
            country: resolver.country,
          },
        ],
      },
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from ${resolver.name}`);
  }

  return data;
}
