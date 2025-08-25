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
