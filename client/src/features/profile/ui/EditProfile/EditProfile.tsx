import { Controller, useForm } from "react-hook-form";
import s from "./EditProfile.module.css";
import { EditSchemaType, editShema } from "../../model/zod/editSchema";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "../../../../shared/api";
import { useProfile } from "../../../../shared/api/queries/useProfile";
import Input from "../../../../shared/ui/Input/Input";
import toast from "react-hot-toast";

export const EditProfile = () => {
  const { me } = useProfile();
  const { control, handleSubmit, reset } = useForm<EditSchemaType>({
    defaultValues: {
      username: "",
      bio: "",
      avatar: undefined,
      // bgImage: undefined
    },
    resolver: zodResolver(editShema),
  });

  const onSubmit = async (data: EditSchemaType) => {
    const userId = me.id;
    try {
      if (!userId) {
        throw new Error("Profile is not correct");
      }
      const res = await updateProfile(userId, data);
      if (res?.status === 200) {
        toast.success("Profile successfully updated");
      }
      reset();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
        throw new Error(error.cause?.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.edit}>
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <input
            type="file"
            onChange={(e) => field.onChange(e.target.files?.[0])}
          />
        )}
      />
      {/* <Controller
            name="bgImage"
            control={control}
            render={({ field }) => (
                <input
                type="file"
                onChange={(e) => field.onChange(e.target.files?.[0])}
                />
            )}
            /> */}
      <Input control={control} name="username" />
      <Controller
        name="bio"
        control={control}
        render={({ field }) => <textarea {...field}></textarea>}
      />
      <button>Edit</button>
    </form>
  );
};
