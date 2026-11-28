import { InformationCache } from "../type";
import { is_proxy } from "../whois_proxy";

const PRIVACY_PATTERN = ["redacted for privacy"];

// A name of a privacy service or a proxy service, not of the real owner.
export async function is_privacy_service(
  name: string,
  cache: InformationCache,
) {
  const privacy = await is_privacy(name);
  return (await is_proxy(name, cache)) || privacy === true;
}

export async function is_privacy(name: string) {
  return await new Promise((resolve) => {
    const match = PRIVACY_PATTERN.some((pattern) => {
      const regex = new RegExp(pattern, "i");
      return regex.test(name);
    });

    resolve(match);
  });
}
