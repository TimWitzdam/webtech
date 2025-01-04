import { z } from "zod";

export const courseJoinRequest = z.object({
  course_id: z.string(),
  permission: z.string(),
});
