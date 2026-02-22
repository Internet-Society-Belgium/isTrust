import { z } from "zod/mini";
import { source_error } from "../../utils/error";

// https://www.merklemap.com/documentation/list-certificates
const merklemapSearchSchema = z.object({
  certificates: z.array(
    z.object({
      not_before: z.string(),
      not_after: z.string(),
      fingerprint_sha256: z.string(),
    }),
  ),
  has_next_page: z.boolean(),
});

export function validate_merkelmap_search(json: unknown) {
  const merkelmapResults = merklemapSearchSchema.safeParse(json);
  if (!merkelmapResults.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(merkelmapResults.error)}`,
    );
  }
  return merkelmapResults.data;
}

// https://www.merklemap.com/documentation/get-certificate
const merklemapCertificateSchema = z.object({
  x509_info: z.object({
    is_valid: z.boolean(),
  }),
  raw_certificate_der: z.string(),
});

export function validate_merkelmap_certificate(json: unknown) {
  const merkelmapCertificate = merklemapCertificateSchema.safeParse(json);
  if (!merkelmapCertificate.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(merkelmapCertificate.error)}`,
    );
  }
  return merkelmapCertificate.data;
}
