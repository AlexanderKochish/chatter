import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024;

export const messageSchema = z.object({
  text: z.string().trim(),
  roomId: z.string(),
  ownerId: z.string(),
  images: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "The file must be no larger than 500KB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only images can be uploaded",
    })
    .array()
    .optional(),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
