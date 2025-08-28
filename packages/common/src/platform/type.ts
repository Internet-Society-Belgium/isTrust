import { Information } from "../type";

export type Platform = "disposable_email" | "url_shortener";

export interface PlatformData {
  platforms: Information<Platform>[];
}
