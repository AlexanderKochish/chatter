import CropFileModal from '@/features/send-message/ui/CropFileModal/CropFileModal'
import { useImageAttachment } from '@/shared/hooks/useImageAttachment'
import { Input } from '@/shared/ui/Input/Input'
import ReactCrop from 'react-image-crop'
import s from './ImageViewer.module.css'
import Button from '@/shared/ui/Button/Button'
import {
  Control,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'
import { MessageSchemaType } from '@/features/send-message/model/zod/message.schema'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import PopoverCustom from '@/shared/ui/Popover/PopoverCustom'
import { EmojiIcon } from '@/shared/assets/icons'
import { useEffect } from 'react'
import { RootState } from '@/app/store/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCompletedCrop,
  setCrop,
  setIsOpen,
} from '../../model/store/image.store'

type Props = {
  handleSubmit: (e?: React.BaseSyntheticEvent) => void
  setValue: UseFormSetValue<MessageSchemaType>
  control: Control<MessageSchemaType>
  handleEmojiClick: (emoji: EmojiClickData) => void
  reset: () => void
  errors?: string
  setError: UseFormSetError<MessageSchemaType>
  clearError: UseFormClearErrors<MessageSchemaType>
}

const ImageViewer = ({
  handleSubmit,
  setValue,
  control,
  handleEmojiClick,
  reset,
  errors,
  setError,
  clearError,
}: Props) => {
  const dispatch = useDispatch()
  const { imgSrc, isOpen, crop } = useSelector(
    (state: RootState) => state.imageViewer
  )
  const { imgRef, onCropComplete } = useImageAttachment(
    setValue,
    setError,
    clearError
  )

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  return (
    <CropFileModal
      dispatch={dispatch}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      position="50"
    >
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => dispatch(setCrop(percentCrop))}
          onComplete={(c) => dispatch(setCompletedCrop(c))}
          minWidth={400}
          minHeight={200}
          circularCrop
          ruleOfThirds
        >
          <img className={s.cropImg} ref={imgRef} alt="Crop me" src={imgSrc} />
        </ReactCrop>
      )}
      {errors && <span style={{ color: 'red' }}>{errors}</span>}
      <form className={s.form} onSubmit={handleSubmit}>
        <PopoverCustom trigger={<EmojiIcon width="30" height="30" />}>
          <EmojiPicker
            searchDisabled
            lazyLoadEmojis
            theme={Theme.AUTO}
            onEmojiClick={handleEmojiClick}
          />
        </PopoverCustom>
        <Input control={control} name="text" placeholder="Message..." />
        <Button size="large" onClick={onCropComplete}>
          Send
        </Button>
      </form>
    </CropFileModal>
  )
}

export default ImageViewer
