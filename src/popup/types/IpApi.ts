export interface IpApi {
  status: 'success' | 'fail'
  country: string
  countryCode: string // ISO_3166-1_alpha-2
}
