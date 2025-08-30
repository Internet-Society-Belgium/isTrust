/* eslint-disable no-unused-vars */
import * as history from "@/entrypoints/background/history";
import * as common from "@istrust/common";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  get_domain(data: {
    query: string;
  }): Awaited<ReturnType<typeof common.get_domain>>;
  get_blacklist_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_blacklist_data>>;
  get_platform_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_platform_data>>;
  get_whois_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_whois_data>>;
  get_certificate_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_certificate_data>>;
  get_dnssec_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof common.get_dnssec_data>>;
  get_history_data(data: {
    domain: string;
  }): Awaited<ReturnType<typeof history.get_history_data>>;
}

export const messenger = defineExtensionMessaging<ProtocolMap>();
