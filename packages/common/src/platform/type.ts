import { Information } from "../type";

export type Platform = "disposable_email" | "url_shortner";

export interface PlatformData {
  platforms: Information<Platform>[];
}
