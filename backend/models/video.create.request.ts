import { z } from "zod";

export const videoCreateRequest = z.object({
  title: z.string(),
  length: z.number(),
});
