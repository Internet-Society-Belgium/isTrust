/* eslint-disable no-unused-vars */
import { WHOISData } from "@istrust/common";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  get_domain(data: { query: string }): string | undefined;
  get_whois_data(data: { domain: string }): WHOISData;
  is_dnssec_valid(data: { domain: string; resolver?: string }): boolean;
  force_update_cache(): void;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
