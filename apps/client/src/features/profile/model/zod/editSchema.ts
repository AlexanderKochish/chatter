import { z } from "zod";

export const editShema = z.object({
  username: z.string().optional(),
  bio: z.string().optional(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "The file must be less then 1 MB",
    })
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/avif",
          "image/webp",
        ].includes(file.type),
      {
        message: "Only jpeg, jpg, png, webp, avif are allowed",
      },
    )
    .optional(),
  // bgImage: z.instanceof(File)
  // .refine((file) => file.size <= 1 * 1024 * 1024, {
  //     message: 'The file must be less then 1 MB'
  // })
  // .refine((file) => ['image/jpeg','image/jpg','image/png','image/avif','image/webp'].includes(file.type), {
  //     message: 'Only jpeg, jpg, png, webp, avif are allowed'
  // }).optional(),
});

export type EditSchemaType = z.infer<typeof editShema>;
