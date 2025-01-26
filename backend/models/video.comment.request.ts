import { z } from "zod";

export const videoCommentRequest = z.object({
  videoId: z.string(),
  text: z.string(),
});
