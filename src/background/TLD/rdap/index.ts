import axios from 'axios'
import { Website } from '..'
import { Data } from '../../../types/Data'
import { RDAPData } from '../../../types/Rdap'
import { RDAP } from '../../utils/rdap'

export default class Website_rdap extends Website {
  constructor(hostname: string) {
    super(hostname)
  }

  public async data(): Promise<Data | undefined> {
    let data: Data = {} as Data

    let rdapUrls = await RDAP.getRDAPUrls(this.tld)
    if (!rdapUrls) return

    while (rdapUrls.length !== 0) {
      const url = rdapUrls[0]
      rdapUrls.shift()

      const { status, data: rdapData } = await axios.get<RDAPData>(
        `${url}/domain/${this.domain}`
      )
      if (status !== 200) return

      let parsedData: Data = {} as Data

      const links = await RDAP.links(rdapData)
      for (const link of links) {
        rdapUrls.push(link)
      }

      const events = await RDAP.events(rdapData)
      if (events) {
        parsedData.events = events
      }

      const registrant = await RDAP.registrant(rdapData)
      if (registrant) {
        parsedData.registrant = registrant
      }

      const dnssec = await RDAP.dnssec(rdapData)
      parsedData.dnssec = dnssec

      data = { ...parsedData, ...data }
    }

    return data
  }
}
