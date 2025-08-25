import * as dnsPacket from "@leichtgewicht/dns-packet";
import { source_error } from "../error";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uint8ToBase64(buffer: Uint8Array) {
  let binary = "";
  for (const byte of buffer) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export async function resolve(resolver: string, domain: string) {
  // https://www.rfc-editor.org/rfc/rfc1035.html
  const queryBuffer = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
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
