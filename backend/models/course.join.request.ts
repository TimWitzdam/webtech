import { z } from "zod";

export const courseJoinRequest = z.object({
  courseId: z.string(),
  permission: z.string(),
});
