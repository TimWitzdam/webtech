import { z } from "zod";

export const courseAddRequest = z.object({
  courseId: z.string(),
  videoId: z.string(),
});
