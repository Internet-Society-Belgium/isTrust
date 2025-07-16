import { z } from "zod";

const CrtshSearchSchema = z.object({
  id: z.number(),
});
const CrtshSearchListSchema = z.array(CrtshSearchSchema);

export function validateCrtshSearch(json: unknown) {
  const crtshResults = CrtshSearchListSchema.safeParse(json);
  if (!crtshResults.success)
    throw new Error(`Invalid crtsh response (${crtshResults.error.message})`);
  return crtshResults.data;
}
