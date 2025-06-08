import CropFileModal from "@/features/send-message/ui/CropFileModal/CropFileModal";
import { useImageAttachment } from "@/shared/hooks/useImageAttachment";
import Input from "@/shared/ui/Input/Input";
import ReactCrop from "react-image-crop";
import s from './ImageViewer.module.css'
import Button from "@/shared/ui/Button/Button";
import { Control, UseFormSetValue } from "react-hook-form";
import { MessageSchemaType } from "@/features/send-message/model/zod/message.schema";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import PopoverCustom from "@/shared/ui/Popover/PopoverCustom";
import { EmojiIcon } from "@/shared/assets/icons";
import { useEffect } from "react";

type Props =  {
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  setValue: UseFormSetValue<MessageSchemaType>;
  control: Control<MessageSchemaType>;
  handleEmojiClick: (emoji: EmojiClickData) => void
  reset: () => void;
}

const ImageViewer = ({ handleSubmit, setValue, control, handleEmojiClick, reset }: Props) => {

  const { 
    setCompletedCrop, 
    setCrop, 
    isOpen, 
    crop, 
    imgRef, 
    imgSrc, 
    onCropComplete, 
    setIsOpen
  } = useImageAttachment(setValue)

  useEffect(() => {
    if(!isOpen){
      reset()
    }
  }, [isOpen])

  return (
    <CropFileModal setIsOpen={setIsOpen} isOpen={isOpen} position="50">
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          minWidth={400}
          minHeight={200}
          circularCrop
          ruleOfThirds
        >
          <img className={s.cropImg} ref={imgRef} alt="Crop me" src={imgSrc} />
        </ReactCrop>
      )}
      <form className={s.form} onSubmit={handleSubmit}>
         <PopoverCustom trigger={<EmojiIcon width="30" height="30" />}>
          <EmojiPicker
            searchDisabled
            lazyLoadEmojis
            theme={Theme.AUTO}
            onEmojiClick={handleEmojiClick}
          />
        </PopoverCustom>
        <Input control={control} name="text" placeholder="Message..."/>
        <Button size="large" onClick={onCropComplete}>Send</Button>
      </form>
    </CropFileModal>
  );
};

export default ImageViewer;
