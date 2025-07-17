import { Buffer as BufferPolyfill } from "buffer";
import dnsPacket from "dns-packet";

// declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

const DEFAULT_RESOLVER = "https://cloudflare-dns.com/dns-query";

export async function is_valid(domain: string, resolver?: string) {
  if (resolver === undefined) {
    resolver = DEFAULT_RESOLVER;
  }

  try {
    // https://www.rfc-editor.org/rfc/rfc1035.html
    const buf = dnsPacket.encode({
      type: "query",
      id: Math.floor(Math.random() * 65534),
      flags: dnsPacket.RECURSION_DESIRED | dnsPacket.AUTHENTIC_DATA,
      questions: [
        {
          type: "A",
          name: domain,
        },
      ],
    });

    const dnsQueryParam = buf.toString("base64").replace(/=/g, "");

    const res = await fetch(`${resolver}?dns=${dnsQueryParam}`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "application/dns-message",
      },
    });

    const data = await res.arrayBuffer();
    const decoded = dnsPacket.decode(Buffer.from(data));

    // https://datatracker.ietf.org/doc/rfc3655/
    return decoded.flag_ad;
  } catch (error) {
    console.error(error);

    return;
  }
}
