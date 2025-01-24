import { z } from "zod";

export const userWatchRequest = z.object({
  videoId: z.string(),
  progress: z.number(),
});
