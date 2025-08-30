import * as dnsPacket from "@leichtgewicht/dns-packet";
import { source_error } from "../error";

function uint8ToBase64(buffer: Uint8Array) {
  const binString = String.fromCodePoint(...buffer);
  return btoa(binString);
}

export async function resolve(resolver: string, domain: string) {
  // https://www.rfc-editor.org/rfc/rfc1035.html
  const queryBuffer = dnsPacket.encode({
    type: "query",
    flags:
      dnsPacket.RECURSION_DESIRED |
      dnsPacket.AUTHENTIC_DATA |
      dnsPacket.DNSSEC_OK,
    questions: [
      {
        type: "A",
        name: domain,
      },
    ],
  });

  const dnsQueryParam = uint8ToBase64(queryBuffer);

  const res = await fetch(`${resolver}?dns=${dnsQueryParam}`, {
    headers: {
      Accept: "application/dns-message",
    },
  });

  if (!res.ok) throw source_error("No DNS response");

  const resBytes = await res.bytes();
  const decoded = dnsPacket.decode(resBytes);

  return decoded;
}
