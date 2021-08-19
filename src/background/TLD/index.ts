import { Dns } from '../../types/Dns'
import { parseHostname } from '../utils/url'

export abstract class Website {
  readonly domain: string
  protected tld: string

  constructor(url: string) {
    const { protocol, hostname } = new URL(url)
    const { domain, tld } = parseHostname(hostname)

    this.domain = domain
    this.tld = tld
  }

  public abstract data(): Promise<Data | undefined>
}
