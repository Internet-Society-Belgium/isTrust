import { deepMerge } from "../utils/object";
import * as sslmate from "./sslmate";
import { CertificateType } from "./type";

export async function get_data(domain: string) {
  let certificatesData = await sslmate.get_data(domain);

  if (certificatesData === undefined || certificatesData.length === 0) return;

  let bestType: CertificateType | undefined;
  for (const d of certificatesData) {
    if (
      bestType === undefined ||
      certificateTypeScore(d.type) > certificateTypeScore(bestType)
    ) {
      bestType = d.type;
    }
  }

  certificatesData = certificatesData.filter((d) => d.type === bestType);

  const certificateData = certificatesData.shift();
  for (const d of certificatesData) {
    deepMerge(certificateData, d);
  }

  return certificateData;
}

function certificateTypeScore(type?: CertificateType) {
  if (type === "EV (.onion)") return 5;
  else if (type === "EV") return 4;
  else if (type === "IV") return 3;
  else if (type === "OV") return 2;
  else if (type === "DV") return 1;
  return 0;
}
