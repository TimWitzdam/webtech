import { z } from "zod";

export const videoCommentRequest = z.object({
  video_id: z.string(),
  text: z.string(),
  timestamp: z.number(),
});
