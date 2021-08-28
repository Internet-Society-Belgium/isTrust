export interface IpApi {
    status: 'success' | 'fail'
    country: string
    countryCode: string // ISO 3166-1 alpha-2
}
