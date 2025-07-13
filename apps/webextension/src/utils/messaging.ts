/* eslint-disable no-unused-vars */
import { WHOISData } from "@istrust/common";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  whois(data: { domain: string }): WHOISData;
  force_update_cache(): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
