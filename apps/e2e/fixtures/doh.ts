import * as dns_packet from "@dnsquery/dns-packet";
import type { Request } from "@playwright/test";

// The DNSSEC check sends a binary DNS query (RFC 8484) with a random ID to a
// resolver picked at random, so it can't be replayed from a recording. This
// answers any resolver instead: it echoes the query, and sets the AD flag
// (RFC 4035) the way the scenario says.

export function is_doh_request(request: Request): boolean {
  return (
    request.method() === "POST" &&
    request.headers()["content-type"] === "application/dns-message"
  );
}

export function doh_answer(request: Request, authenticated: boolean): Buffer {
  const body = request.postDataBuffer();
  if (body === null) throw new Error("DoH request without a body");
  const query = dns_packet.decode(body);

  const flags =
    dns_packet.RECURSION_DESIRED |
    dns_packet.RECURSION_AVAILABLE |
    (authenticated ? dns_packet.AUTHENTIC_DATA : 0);

  return Buffer.from(
    dns_packet.encode({
      type: "response",
      id: query.id,
      flags,
      questions: query.questions,
      answers: (query.questions ?? []).map((question) => ({
        type: "A" as const,
        name: question.name,
        ttl: 300,
        data: "192.0.2.1",
      })),
    }),
  );
}

/** Reads the AD flag of a real DoH response, when recording. */
export function doh_authenticated(body: Buffer): boolean {
  return dns_packet.decode(body).flag_ad === true;
}
