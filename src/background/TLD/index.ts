import { Data } from '../../types/Data'
import { parseHostname } from '../utils/url'

export abstract class Website {
  readonly domain: string
  readonly tld: string

  constructor(hostname: string) {
    const { domain, tld } = parseHostname(hostname)

    this.domain = domain
    this.tld = tld
  }

  public abstract data(): Promise<Data | undefined>
}
