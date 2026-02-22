import { source_error } from "../../utils/error";
import * as x509 from "../x509";
import { X509Data } from "../x509/type";
import {
  validate_merkelmap_certificate,
  validate_merkelmap_search,
} from "./type";

export async function get_data(domain: string) {
  const data: X509Data[] = [];

  try {
    let page = 0;
    let has_next_page = true;
    const results = [];

    while (has_next_page) {
      const resSearch = await fetch(
        `https://api.merklemap.com/v1/certificates/${domain}?page=${page.toString()}`,
      );

      if (!resSearch.ok) throw source_error("No certificate response");

      const jsonSearch: unknown = await resSearch.json();
      const resultsSearch = validate_merkelmap_search(jsonSearch);

      results.push(...resultsSearch.certificates);

      has_next_page = resultsSearch.has_next_page;
      page += 1;
    }

    const now = new Date();

    for (const result of results) {
      try {
        const notBefore = new Date(result.not_before);
        const notAfter = new Date(result.not_after);
        if (now < notBefore || now > notAfter) continue;
      } catch (error) {
        console.error(error);
      }

      const resCertificate = await fetch(
        `https://api.merklemap.com/v1/certificates/hash/${result.fingerprint_sha256}`,
      );

      if (!resCertificate.ok) throw source_error("No certificate response");

      const jsonCertificate: unknown = await resCertificate.json();
      const resultCertificate = validate_merkelmap_certificate(jsonCertificate);

      if (!resultCertificate.x509_info.is_valid) continue;

      const cert = x509.parse_cert(resultCertificate.raw_certificate_der);

      if (!(await x509.is_valid_cert(cert, domain))) continue;

      data.push(x509.get_data(cert));
    }
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Merkelmap`);
  }

  return data;
}
