import { z } from "zod";

export const videoLikeRequest = z.object({
  commentId: z.string(),
});
