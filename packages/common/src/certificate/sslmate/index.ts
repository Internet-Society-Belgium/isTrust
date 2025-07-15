import * as x509 from "@peculiar/x509";
import { isValidCert, parseCert } from "../utils/x509";
import { validateSSLMateSearch } from "./type";
import { CertificateData } from "../type";

export async function get_data(domain: string) {
  try {
    // https://sslmate.com/help/reference/ct_search_api_v1#api_list
    const resSearch = await fetch(
      `https://api.certspotter.com/v1/issuances?domain=${domain}&match_wildcards=true&expand=dns_names&expand=cert_der`,
      { cache: "no-cache" },
    );
    const jsonSearch = await resSearch.json();
    const resultsSearch = validateSSLMateSearch(jsonSearch);
    if (resultsSearch.length === 0) return;

    let data: CertificateData[] = [];
    for (const resultSearch of resultsSearch) {
      if (resultSearch.revoked) continue;

      const cert = new x509.X509Certificate(resultSearch.cert_der);

      if (!isValidCert(cert, domain)) continue;

      data.push(parseCert(cert));
    }

    return data;
  } catch (e) {
    const error = e as Error;
    console.error(error.message);

    return;
  }
}
