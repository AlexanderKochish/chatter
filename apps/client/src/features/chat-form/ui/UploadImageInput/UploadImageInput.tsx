import { useChatFormLogic } from '@/features/send-message/model/hooks/useChatFormLogic'
import { UploadIcon } from '@/shared/assets/icons'
import ImageViewer from '@/features/image-viewer/ui/ImageViewer/ImageViewer'
import clsx from 'clsx'

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
  } = useChatFormLogic()

  const errorImageUpload = errors.images?.[0]?.message

  return (
    <>
      <label
        htmlFor="images"
        className={clsx(
          'cursor-pointer px-[15px] pt-[5px] pb-0 transition-colors duration-200',
          'text-neutral-400 hover:text-[#7fb6ff]' // Твой цвет rgb(127, 182, 255)
        )}
      >
        <UploadIcon width="30" height="30" />
      </label>

      <input
        type="file"
        id="images"
        className="hidden"
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
  )
}

export default UploadImageInput
