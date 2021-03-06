export type Certificate = ValidCertificate | InvalidCertificate

interface ValidCertificate {
    valid: true
    protocol: string
    owner?: Owner
}

interface Owner {
    organisation: string
    location?: {
        state: string
        region: string
        country: string
    }
}

interface InvalidCertificate {
    valid: false
    error: string
}
