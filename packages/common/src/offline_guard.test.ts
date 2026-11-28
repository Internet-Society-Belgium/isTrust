// Checks that the offline guard (`vitest.offline.ts`) is active: if it stopped
// working, a network call in a `*.test.ts` file would pass unnoticed again.
/// <reference types="node" />
import dgram from "node:dgram";
import dns, { lookup as named_lookup } from "node:dns";
import dns_promises from "node:dns/promises";
import https from "node:https";
import net from "node:net";
import { describe, expect, test } from "vitest";
import {
  check_network_attempts,
  take_network_attempts,
} from "../vitest.offline";

const message = /Network access in an offline test/;

describe("offline guard", () => {
  test("rejects fetch", async () => {
    await expect(fetch("https://example.com/")).rejects.toThrow(message);
    expect(take_network_attempts()).toEqual(["https://example.com/"]);
  });

  test("records an attempt even when the error is swallowed", async () => {
    await fetch("https://example.com/").catch(() => undefined);
    expect(take_network_attempts()).toEqual(["https://example.com/"]);
  });

  test("rejects WebSocket", () => {
    expect(() => new WebSocket("wss://example.com/")).toThrow(message);
    expect(take_network_attempts()).toEqual(["wss://example.com/"]);
  });

  test("rejects node:https", () => {
    expect(() => https.get("https://example.com/")).toThrow(message);
    // Caught by the DNS stub or the socket stub, whichever Node reaches first.
    expect(take_network_attempts()).toEqual([
      expect.stringContaining("example.com"),
    ]);
  });

  test("rejects TCP sockets", () => {
    expect(() => net.connect(443, "example.com")).toThrow(message);
    // An options object without a port: the message must not show `[object Object]`.
    const socket = new net.Socket();
    const connect_without_port = socket.connect.bind(socket) as (
      options: object,
    ) => void;
    expect(() => {
      connect_without_port({ host: "example.com" });
    }).toThrow(message);
    expect(take_network_attempts()).toEqual(["example.com:443", "example.com"]);
  });

  test("rejects UDP", () => {
    const socket = dgram.createSocket("udp4");
    expect(() => {
      socket.send("x", 53, "192.0.2.1");
    }).toThrow(message);
    expect(() => {
      socket.connect(53, () => undefined);
    }).toThrow(message);
    socket.close();
    expect(take_network_attempts()).toEqual([
      "UDP to 192.0.2.1",
      "UDP to localhost",
    ]);
  });

  // The hooks in vitest.offline.ts call this before each test, after each
  // test, and after the file, so an attempt made anywhere fails the run.
  test("reports recorded attempts once, then forgets them", async () => {
    await fetch("https://example.com/").catch(() => undefined);
    expect(() => {
      check_network_attempts("in beforeAll");
    }).toThrow(/https:\/\/example\.com\/.*\(in beforeAll\)/);
    expect(() => {
      check_network_attempts("in beforeAll");
    }).not.toThrow();
  });

  test("rejects DNS queries in every form", async () => {
    await expect(dns_promises.lookup("example.com")).rejects.toThrow(message);
    await expect(dns_promises.resolveTxt("example.com")).rejects.toThrow(
      message,
    );
    await expect(
      new dns_promises.Resolver().resolve4("example.com"),
    ).rejects.toThrow(message);
    expect(() => {
      dns.resolve4("example.com", () => undefined);
    }).toThrow(message);
    expect(() => {
      named_lookup("example.com", () => undefined);
    }).toThrow(message);
    expect(take_network_attempts()).toEqual([
      "DNS lookup of example.com",
      "DNS resolveTxt of example.com",
      "DNS resolve4 of example.com",
      "DNS resolve4 of example.com",
      "DNS lookup of example.com",
    ]);
  });
});
