export function extractDomain(url: string) {
  return new URL(url).hostname;
}
