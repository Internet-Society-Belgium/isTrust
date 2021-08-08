import { DNS } from '../../types/Status'
import { Registration, Contact } from '../../types/api/DnsBelgium'
import axios from 'axios'
import { Country } from './all'

export default class Belgium extends Country {
  constructor(hostname: string) {
    super(hostname)
  }

  public get dns(): Promise<DNS> {
    return new Promise(async (resolve, reject) => {
      const registration = await axios.get<Registration>(
        `https://api.dnsbelgium.be/whois/registration/${this.domain}`
      )
      if (registration.status !== 200) return reject()

      const registrant = await axios.get<Contact>(
        `https://api.dnsbelgium.be/whois/contact/${registration.data.registrant}`
      )

      if (registrant.status !== 200) return reject()

      resolve({
        country: 'be',
        domainInfo: {
          updated: registration.data.domainInfo.updated,
        },
        registrant: {
          companyName: registrant.data.companyName,
        },
      })
    })
  }
}
