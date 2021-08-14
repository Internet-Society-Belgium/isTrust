import * as psl from 'psl'
import { UrlParsed } from '../../types/Url'

export function parseHostname(hostname: string): UrlParsed | undefined {
  const parsedHostname = psl.parse(hostname)
  if (parsedHostname?.error) return

  const { domain, tld } = parsedHostname
  if (!domain || !tld) return
  return {
    domain,
    tld,
  }
}
