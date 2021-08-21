import { IanaRDAPList, RDAPData } from '../types/Rdap'
import { Events, Registrant } from '../types/Dns'
import axios from 'axios'

export class RDAP {
  private static cachedIanaRdapList: IanaRDAPList

  private static async ianaRdap(): Promise<IanaRDAPList | undefined> {
    const { status, data } = await axios.get<IanaRDAPList>(
      `https://data.iana.org/rdap/dns.json`
    )
    if (status !== 200) return
    return data
  }

  public static async urls(tld: string): Promise<string[] | undefined> {
    if (!RDAP.cachedIanaRdapList) {
      const ianaRdap = await RDAP.ianaRdap()
      if (!ianaRdap) return
      RDAP.cachedIanaRdapList = ianaRdap
    }

    const data = RDAP.cachedIanaRdapList.services.find((e) =>
      e[0].includes(tld)
    )
    if (!data) return

    return data[1]
  }

  public static links(data: RDAPData): string[] {
    const links = data.links.filter((e) => e.rel !== 'self')

    return links.map((e) => e.href.replace(/domain\/.*/, ''))
  }

  public static events(data: RDAPData): Events | undefined {
    const registration = data.events.find(
      (e) => e.eventAction === 'registration'
    )
    if (!registration) return

    const lastChanged = data.events.find(
      (e) => e.eventAction === 'last changed'
    )

    const expiration = data.events.find((e) => e.eventAction === 'expiration')

    const transfer = data.events.find((e) => e.eventAction === 'transfer')

    return {
      registration: registration.eventDate,
      lastChanged: lastChanged?.eventDate,
      expiration: expiration?.eventDate,
      transfer: transfer?.eventDate,
    }
  }

  public static registrant(data: RDAPData): Registrant | undefined {
    const company = data.entities.find((e) => e.roles.includes('registrant'))
    if (!company) return

    const vCard = company?.vcardArray[1]
    if (!(vCard instanceof Array)) return

    const organisationCard = vCard.find((e) => e[0] === 'org')
    if (!organisationCard) return

    const organisation = organisationCard[3]
    if (typeof organisation != 'string') return

    return {
      organisation,
    }
  }

  public static dnssec(data: RDAPData): boolean {
    return data.secureDNS.delegationSigned
  }
}
