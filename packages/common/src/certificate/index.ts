import { deepMerge } from "../utils/object";
import * as crtsh from "./crtsh";
import * as sslmate from "./sslmate";
import { CertificateData, CertificateType } from "./type";

export async function get_data(domain: string) {
  let data: CertificateData[] | undefined;

  data = await sslmate.get_data(domain);

  if (data === undefined || data.length === 0) return;

  let bestType: CertificateType = "DV";
  for (const d of data) {
    if (d.type !== undefined) {
      if (certificateTypeScore(d.type) > certificateTypeScore(bestType)) {
        bestType = d.type;
      }
    }
  }

  data = data.filter((d) => d.type === bestType);

  const c: CertificateData = {};
  for (const d of data) {
    deepMerge(c, d);
  }

  return c;
}

function certificateTypeScore(type: CertificateType) {
  if (type === "EV") return 4;
  else if (type === "EV (.onion)") return 3;
  else if (type === "IV") return 2;
  else if (type === "OV") return 1;
  return 0;
}
