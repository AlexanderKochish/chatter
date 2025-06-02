import toast from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Text copied");
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }
};
