import { z } from "zod";

export const courseCreateRequest = z.object({
  name: z.string(),
  slug: z.string(),
});
