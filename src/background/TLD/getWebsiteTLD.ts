import { Website } from '.'
import { parseHostname } from '../utils/url'
import Website_be from './api/be'
import Website_rdap from './rdap'

export default function (hostname: string): Website | undefined {
  const parsedHostname = parseHostname(hostname)
  if (!parsedHostname) return

  const { tld } = parsedHostname

  if (tld === 'be') {
    return new Website_be(hostname)
  }
  return new Website_rdap(hostname)
}
