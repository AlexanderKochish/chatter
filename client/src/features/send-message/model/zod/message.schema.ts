import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().trim(),
  roomId: z.string(),
  ownerId: z.string(),
  images: z.instanceof(File).array().optional(),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
