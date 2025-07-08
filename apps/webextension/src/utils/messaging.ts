/* eslint-disable no-unused-vars */
import { HistoryData } from "@/entrypoints/background/history";
import { defineExtensionMessaging } from "@webext-core/messaging";

interface ProtocolMap {
  history(data: { domain: string }): HistoryData;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
