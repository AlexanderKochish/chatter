import { useChatFormLogic } from "@/features/send-message/model/hooks/useChatFormLogic";
import { UploadIcon } from "@/shared/assets/icons";
import s from "./UploadImageInput.module.css";
import ImageViewer from "@/features/image-viewer/ui/ImageViewer/ImageViewer";

const UploadImageInput = () => {
  const {
    formProps: {
      handleSubmit,
      control,
      setValue,
      reset,
      errors,
      setError,
      clearErrors,
    },
    fileInputProps: { handleFileChange },
    emoji: { handleEmojiClick },
  } = useChatFormLogic();
  const errorImageUpload = errors.images?.[0]?.message;
  return (
    <>
      <label htmlFor="images" className={s.fileLabel}>
        <UploadIcon width="30" height="30" />
      </label>
      <input
        type="file"
        id="images"
        className={s.file}
        onChange={handleFileChange}
      />
      <ImageViewer
        control={control}
        handleEmojiClick={handleEmojiClick}
        handleSubmit={handleSubmit}
        reset={reset}
        setValue={setValue}
        errors={errorImageUpload}
        setError={setError}
        clearError={clearErrors}
      />
    </>
  );
};

export default UploadImageInput;
