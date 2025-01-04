import { z } from "zod";

export const courseAddRequest = z.object({
  course_id: z.string(),
  video_id: z.string(),
});
