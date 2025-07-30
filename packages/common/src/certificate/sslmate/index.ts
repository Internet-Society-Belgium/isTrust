import { source_error } from "../../utils/error";
import * as x509 from "../x509";
import { X509Data } from "../x509/type";
import { validateSSLMateSearch } from "./type";

export async function get_data(domain: string) {
  const data: X509Data[] = [];

  try {
    // https://sslmate.com/help/reference/ct_search_api_v1#api_list
    const res = await fetch(
      `https://api.certspotter.com/v1/issuances?domain=${domain}&match_wildcards=true&expand=dns_names&expand=cert_der`,
    );

    if (!res.ok) throw source_error("Certspotter not available");

    const jsonSearch: unknown = await res.json();
    const resultsSearch = validateSSLMateSearch(jsonSearch);

    for (const resultSearch of resultsSearch) {
      if (resultSearch.revoked) continue;

      const cert = x509.parse_cert(resultSearch.cert_der);

      if (!(await x509.is_valid_cert(cert, domain))) continue;

      data.push(x509.get_data(cert));
    }
  } catch (e) {
    console.error(e);
  }

  return data;
}
