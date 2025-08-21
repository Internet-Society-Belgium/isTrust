/* eslint-disable no-unused-vars */
import * as history from "@/entrypoints/background/history";
import * as common from "@istrust/common";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  get_effective_domain(data: {
    query: string;
  }): Awaited<ReturnType<typeof common.get_effective_domain>>;
  get_whois_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_whois_data>>;
  get_dnssec_data(data: {
    domain: string;
    resolver?: string;
  }): Awaited<ReturnType<typeof common.get_dnssec_data>>;
  get_history_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof history.get_history_data>>;
  get_certificate_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_certificate_data>>;
}

export const messenger = defineExtensionMessaging<ProtocolMap>();
