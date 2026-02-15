import { boolean } from "zod";
import { z } from "zod/mini";
import { source_error } from "../../utils/error";

// https://www.merklemap.com/documentation/list-certificates
const merklemapSearchSchema = z.object({
  certificates: z.array(
    z.object({
      is_precertificate: z.boolean(),
      subject_common_name: z.string(),
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
  printed_certificate: z.string(),
  x509_info: z.object({
    not_before: z.string(),
    not_after: z.string(),
    is_valid: z.boolean(),
    public_key_algorithm: z.string(),
    public_key_params: z.string(),
    signature_algorithm: z.string(),
    signature_value: z.string(),
  }),
  issuer: z.string(),
  logs: z.array(z.string()),
  is_precertificate: z.boolean(),
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
