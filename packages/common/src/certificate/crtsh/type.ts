import { z } from "zod/mini";
import { source_error } from "../../utils/error";

const crtshSearchSchema = z.array(
  z.object({
    id: z.number(),
  }),
);

export function validate_crtsh_search(json: unknown) {
  const crtshResults = crtshSearchSchema.safeParse(json);
  if (!crtshResults.success) {
    throw source_error(
      `Invalid result format:\n${z.prettifyError(crtshResults.error)}`,
    );
  }
  return crtshResults.data;
}
