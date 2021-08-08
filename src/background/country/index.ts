import { DNS } from '../../types/Status'

export default class Country {
  hostname: string

  constructor(hostname: string) {
    this.hostname = hostname
  }

  public get dns(): Promise<DNS> {
    return new Promise((resolve, reject) => {
      return {} as DNS
    })
  }
}
