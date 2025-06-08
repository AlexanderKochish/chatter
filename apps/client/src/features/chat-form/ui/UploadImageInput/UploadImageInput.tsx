import { useChatFormLogic } from '@/features/send-message/model/hooks/useChatFormLogic';
import { UploadIcon } from '@/shared/assets/icons';
import s from './UploadImageInput.module.css'
import ImageViewer from '@/features/image-viewer/ui/ImageViewer/ImageViewer';

const UploadImageInput = () => {
    const {
      formProps: { 
        handleSubmit, 
        control,
        setValue,
        reset
      },
      fileInputProps:{ handleFileChange},
      emoji: { handleEmojiClick },
    } = useChatFormLogic();
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
        />
    </>
  )
}

export default UploadImageInput
