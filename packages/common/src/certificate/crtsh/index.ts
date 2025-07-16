import * as x509 from "@peculiar/x509";
import { CertificateData } from "../type";
import { isValidCert, parseCert } from "../utils/x509";
import { validateCrtshSearch } from "./type";

export async function get_data(domain: string) {
  try {
    const resSearch = await fetch(
      `https://crt.sh/json?domain=${domain}&exclude=expired`,
    );
    const jsonSearch = await resSearch.json();
    const resultsSearch = validateCrtshSearch(jsonSearch);
    if (resultsSearch.length === 0) return;

    const data: CertificateData[] = [];
    for (const resultSearch of resultsSearch) {
      try {
        const resCertificate = await fetch(
          `https://crt.sh/?d=${resultSearch.id}`,
        );
        const textCertificate = await resCertificate.text();

        const cert = new x509.X509Certificate(textCertificate);

        if (!isValidCert(cert, domain)) continue;

        data.push(parseCert(cert));
      } catch (e) {
        console.error(e);

        continue;
      }
    }

    return data;
  } catch (e) {
    console.error(e);

    return;
  }
}
