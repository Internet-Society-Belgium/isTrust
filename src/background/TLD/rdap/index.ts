import axios from 'axios'
import { Website } from '..'
import { Data } from '../../../types/Data'
import { IanaRDAPList, RDAPData } from '../../../types/Rdap'
import { RDAP } from '../../utils/rdap'

export default class Website_rdap extends Website {
  private static async fetch(
    url: string,
    domain: string
  ): Promise<RDAPData | undefined> {
    const { status, data } = await axios.get<RDAPData>(
      `${url}/domain/${domain}`
    )
    if (status !== 200) return
    return data
  }

  constructor(hostname: string) {
    super(hostname)
  }

  public async data(): Promise<Data | undefined> {
    let data: Data = {} as Data

    let rdapUrls = await RDAP.getRDAPUrls(this.tld)
    if (!rdapUrls) return

    while (rdapUrls.length !== 0) {
      // console.log(`rdapUrls ${JSON.stringify(rdapUrls)}`)

      const url = rdapUrls[0]
      rdapUrls.shift()
      const rdapData = await Website_rdap.fetch(url, this.domain)
      if (!rdapData) return
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

      // console.log(`parsedData ${JSON.stringify(parsedData)}`)
      // console.log(`data ${JSON.stringify(data)}`)

      data = { ...parsedData, ...data }

      // console.log(`merge ${JSON.stringify(data)}`)
    }

    return data
  }
}
