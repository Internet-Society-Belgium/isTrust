import Country from '.'
import { DNS } from '../../types/Status'
import { Registration, Contact } from '../../types/api/DnsBelgium'
import axios from 'axios'

export default class Belgium extends Country {
  public get dns(): Promise<DNS> {
    return new Promise(async (resolve, reject) => {
      const { data: registration } = await axios.get<Registration>(
        `https://api.dnsbelgium.be/whois/registration/${this.hostname}`
      )

      const { data: registrant } = await axios.get<Contact>(
        `https://api.dnsbelgium.be/whois/contact/${registration.registrant}`
      )

      resolve({
        domainInfo: {
          updated: registration.domainInfo.updated,
        },
        registrant: {
          companyName: registrant.companyName,
        },
      })
    })
  }
}
