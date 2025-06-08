import { ChangeEvent, useRef } from "react";
import { useImgCrop } from "../lib/hooks/useImgCrop";
import { useImageCropStore } from "../model/store/imageCrop.store";
import { UseFormSetValue } from "react-hook-form";
import { MessageSchemaType } from "@/features/send-message/model/zod/message.schema";

export const useImageAttachment = (
  setValue: UseFormSetValue<MessageSchemaType>,
) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const {
    crop,
    imgSrc,
    isOpen,
    rawFile,
    setCompletedCrop,
    setCrop,
    setImgSrc,
    setIsOpen,
    setRawFile,
    completedCrop,
  } = useImageCropStore();

  const { cropImage } = useImgCrop({
    completedCrop,
    imgRef: imgRef.current,
    rawFile,
  });

  const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;

    if (!file) return;

    const preview = URL.createObjectURL(file);
    
    setImgSrc(preview);
    setIsOpen(true);
    
    setRawFile(file);
    setValue("images", [file]);
    e.target.value = "";
  };

  const onCropComplete = async () => {
    const croppedFile = await cropImage();
    if (!croppedFile) return;
    setValue("images", [croppedFile]);
    setIsOpen(false);
  };

  return {
    crop,
    setCrop,
    imgSrc,
    isOpen,
    setIsOpen,
    setCompletedCrop,
    handleFileChange,
    onCropComplete,
    imgRef,
  };
};
