import { z } from "zod";

export const userWatchRequest = z.object({
  video_id: z.string(),
  progress: z.number(),
});
