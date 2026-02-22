import { source_error } from "../../utils/error";
import * as x509 from "../x509";
import { X509Data } from "../x509/type";
import { validate_sslmate_search } from "./type";

export async function get_data(domain: string) {
  const data: X509Data[] = [];

  try {
    // https://sslmate.com/help/reference/ct_search_api_v1#api_list
    const res = await fetch(
      `https://api.certspotter.com/v1/issuances?domain=${domain}&match_wildcards=true&expand=dns_names&expand=cert_der`,
    );

    if (!res.ok) throw source_error("No certificate response");

    const jsonSearch: unknown = await res.json();
    const resultsSearch = validate_sslmate_search(jsonSearch);

    const now = new Date();

    for (const resultSearch of resultsSearch) {
      if (resultSearch.revoked === true) continue;

      try {
        const notBefore = new Date(resultSearch.not_before);
        const notAfter = new Date(resultSearch.not_after);
        if (now < notBefore || now > notAfter) continue;
      } catch (error) {
        console.error(error);
      }

      const cert = x509.parse_cert(resultSearch.cert_der);

      if (!(await x509.is_valid_cert(cert, domain))) continue;

      data.push(x509.get_data(cert));
    }
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Certspotter`);
  }

  return data;
}
