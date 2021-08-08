import psl from 'psl'
import { DNS } from '../../types/Status'

export class Country {
  public domain: string

  constructor(hostname: string) {
    this.domain = psl.get(hostname) || hostname
  }

  public get dns(): Promise<DNS> {
    return new Promise((resolve, reject) => {
      resolve({
        country: null,
      })
    })
  }
}
