import { DNS } from '../../types/Status'

export default class Country {
  hostname: string

  constructor(hostname: string) {
    this.hostname = hostname
  }

  public get dns(): DNS {
    return {} as DNS
  }
}
