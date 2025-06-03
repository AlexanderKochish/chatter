import { z } from "zod";

export const editMessage = z.object({
  editMessage: z.string().min(1).trim(),
});

export type editMessageSchemaType = z.infer<typeof editMessage>;
