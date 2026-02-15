import { source_error } from "../../utils/error";
import * as x509 from "../x509";
import { X509Data } from "../x509/type";
import { validate_crtsh_search } from "./type";

export async function get_data(domain: string) {
  const data: X509Data[] = [];

  try {
    const res = await fetch(
      `https://crt.sh/?exclude=expired&deduplicate=Y&output=json&match=single&CN=${domain}`,
    );

    if (!res.ok) throw source_error("No certificate response");

    const jsonSearch: unknown = await res.json();
    const resultsSearch = validate_crtsh_search(jsonSearch);

    for (const resultSearch of resultsSearch) {
      let textCertificate: string | undefined = undefined;

      let retries = 0;
      while (textCertificate === undefined && retries < 2) {
        try {
          const resCertificate = await fetch(
            `https://crt.sh/?d=${resultSearch.id}`,
          );
          textCertificate = await resCertificate.text();
        } catch (error) {}

        retries += 1;

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (textCertificate === undefined)
        throw new Error("certificate fetch failed");

      const cert = x509.parse_cert(textCertificate);

      if (!(await x509.is_valid_cert(cert, domain))) continue;

      data.push(x509.get_data(cert));
    }
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from crt.sh`);
  }

  return data;
}
