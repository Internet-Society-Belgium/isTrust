import { z } from "zod/mini";
import { source_error } from "../../utils/error";

const responseSchema = z.object({
  blocked: z.boolean(),
});

export function validate_response(json: unknown) {
  const response = responseSchema.safeParse(json);
  if (!response.success)
    throw source_error(
      `Invalid response format:\n${z.prettifyError(response.error)}`,
    );
  return response.data;
}

const metaSchema = z.object({
  meta: z.array(z.object({ name: z.string(), url: z.optional(z.string()) })),
});

export function validate_meta(json: unknown) {
  const meta = metaSchema.safeParse(json);
  if (!meta.success)
    throw source_error(`Invalid meta format:\n${z.prettifyError(meta.error)}`);
  return meta.data;
}
