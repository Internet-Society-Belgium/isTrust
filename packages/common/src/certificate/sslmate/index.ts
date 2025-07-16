import { CertificateData } from "../type";
import * as x509 from "../x509";
import { validateSSLMateSearch } from "./type";

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

    const data: CertificateData[] = [];
    for (const resultSearch of resultsSearch) {
      if (resultSearch.revoked) continue;

      const cert = x509.parse_cert(resultSearch.cert_der);

      if (!x509.is_valid_cert(cert, domain)) continue;

      data.push(x509.get_data(cert));
    }

    return data;
  } catch (e) {
    console.error(e);

    return;
  }
}
