import { z } from "zod";

export const videoCreateRequest = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string(),
  length: z.number(),
});
