import { z } from "zod";

export const authRequest = z.object({
  username: z.string(),
  password: z.string(),
});
