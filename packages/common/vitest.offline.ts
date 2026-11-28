// Offline guard for the `unit` project (`*.test.ts`). Any network access throws,
// so a test that reaches the network fails every time instead of passing only
// while the service is up. Tests that need the network belong in
// `*.live.test.ts`.
//
// Throwing alone isn't enough: the checks catch errors and fall back to a
// default result, so the test would still pass. Every attempt is also
// recorded, and the test fails afterwards whatever the code did with the error.
/// <reference types="node" />
import dgram from "node:dgram";
import dns from "node:dns";
import { syncBuiltinESMExports } from "node:module";
import net from "node:net";
import { afterAll, afterEach, beforeEach } from "vitest";

const attempts: string[] = [];

function offline_message(targets: string): string {
  return (
    `Network access in an offline test: ${targets}. ` +
    "Rename the file to *.live.test.ts, or stub the call."
  );
}

/** Returns the network attempts recorded in the current test, and forgets them. */
export function take_network_attempts(): string[] {
  return attempts.splice(0);
}

/** Throws if any network attempt was recorded since the last check. */
export function check_network_attempts(when: string): void {
  if (attempts.length === 0) return;
  const targets = [...new Set(take_network_attempts())].join(", ");
  throw new Error(`${offline_message(targets)} (${when})`);
}

// Attempts made at module load or in `beforeAll` are reported by the first
// test's `beforeEach`, those in `afterAll` (or in a file without tests) by
// the `afterAll` below, which runs after the file's own hooks.
beforeEach(() => {
  check_network_attempts("at module load or in beforeAll");
});
afterEach(() => {
  check_network_attempts("in this test");
});
afterAll(() => {
  check_network_attempts("in afterAll");
});

class OfflineError extends Error {
  constructor(target: string) {
    super(offline_message(target));
    this.name = "OfflineError";
    attempts.push(target);
  }
}

function url_of(input: unknown): string {
  if (input instanceof Request) return input.url;
  if (input instanceof URL) return input.href;
  return String(input);
}

globalThis.fetch = (input) => Promise.reject(new OfflineError(url_of(input)));

globalThis.WebSocket = class {
  constructor(url: string | URL) {
    throw new OfflineError(url_of(url));
  }
} as unknown as typeof WebSocket;

// TCP: node:http, node:https, node:tls, node:http2 and undici all open their
// connection through net.Socket#connect. Local IPC (a path, not a host) stays
// allowed.
const original_connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (
  this: net.Socket,
  ...args: unknown[]
): net.Socket {
  // net.connect() and friends pass Node's normalized `[options, callback]`.
  const [first, second] = Array.isArray(args[0])
    ? (args[0] as unknown[])
    : args;
  const options = (
    typeof first === "object" && first !== null ? first : {}
  ) as { path?: string; host?: string; port?: number | string };
  const is_ipc =
    options.path !== undefined ||
    (typeof first === "string" && Number.isNaN(Number(first)));
  if (is_ipc) return Reflect.apply(original_connect, this, args) as net.Socket;

  const host =
    options.host ?? (typeof second === "string" ? second : "localhost");
  const port =
    options.port ??
    (typeof first === "number" || typeof first === "string"
      ? first
      : undefined);
  throw new OfflineError(port === undefined ? host : `${host}:${port}`);
};

// UDP: raw DNS clients and anything else on node:dgram.
const udp_error = (address: unknown) =>
  new OfflineError(`UDP to ${String(address)}`);
dgram.Socket.prototype.send = function (...args: unknown[]) {
  // send(msg, [offset, length,] port, address, callback): the address is the
  // last string after the message.
  const address = args.slice(1).findLast((arg) => typeof arg === "string");
  throw udp_error(address ?? "the connected address");
};
dgram.Socket.prototype.connect = function (_port: unknown, address?: unknown) {
  // connect(port, [address,] [callback])
  throw udp_error(typeof address === "string" ? address : "localhost");
};

// DNS: every query function of node:dns and node:dns/promises, the Resolver
// classes, and their callback and promise forms.
const dns_queries = Object.keys(dns).filter(
  (name) => /^(lookup|resolve|reverse)/.test(name) && name !== "Resolver",
);
const dns_error = (name: string, query: unknown) =>
  new OfflineError(`DNS ${name} of ${String(query)}`);

function block_dns(target: object, is_promise: boolean) {
  const methods = target as Record<string, unknown>;
  for (const name of dns_queries) {
    if (typeof methods[name] !== "function") continue;
    methods[name] = is_promise
      ? (query: unknown) => Promise.reject(dns_error(name, query))
      : (query: unknown) => {
          throw dns_error(name, query);
        };
  }
}

block_dns(dns, false);
block_dns(dns.Resolver.prototype, false);
block_dns(dns.promises, true);
block_dns(dns.promises.Resolver.prototype, true);

// Named imports (`import { lookup } from "node:dns"`) read the ES module
// exports, which only pick up the changes above once synced.
syncBuiltinESMExports();
