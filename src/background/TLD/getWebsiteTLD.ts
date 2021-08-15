import { Website } from '.'
import { parseHostname } from '../utils/url'
import Website_be from './api/be'
import Website_rdap from './rdap'

export default function (hostname: string): Website {
  const { tld } = parseHostname(hostname)

  if (tld === 'be') {
    return new Website_be(hostname)
  }
  return new Website_rdap(hostname)
}
