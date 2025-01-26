import { z } from "zod";

export const commentAnswerRequest = z.object({
  commentId: z.string(),
  text: z.string(),
});
