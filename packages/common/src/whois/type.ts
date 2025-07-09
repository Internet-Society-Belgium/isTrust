export interface WHOISData {
  domain: string;
  events?: {
    registration?: Date;
    lastChanged?: Date;
    expiration?: Date;
  };
  registrant?: {
    organisation?: string;
    address?: {
      state?: string;
      region?: string;
      country?: string;
    };
  };
  dnssec?: boolean;
}
