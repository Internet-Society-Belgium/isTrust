import axios from 'axios'
import { Website } from '..'
import { Contact, Registration } from '../../../types/api/DnsBelgium'
import { Dns } from '../../../types/Dns'

export default class Website_be extends Website {
  constructor(hostname: string) {
    super(hostname)
  }

  public async dns(): Promise<Dns | undefined> {
    const { status: registrationStatus, data: registration } =
      await axios.get<Registration>(
        `https://api.dnsbelgium.be/whois/registration/${this.domain}`
      )
    if (registrationStatus !== 200) return

    const { status: registrantStatus, data: registrant } =
      await axios.get<Contact>(
        `https://api.dnsbelgium.be/whois/contact/${registration.registrant}`
      )

    if (registrantStatus !== 200) return

    return {
      events: {
        registration: registration.domainInfo.created,
        lastChanged: registration.domainInfo.updated,
      },
      registrant: {
        organisation: registrant.companyName,
      },
      dnssec: registration.dnsKeyInfo.dnsKeys.length !== 0,
    }
  }
}
