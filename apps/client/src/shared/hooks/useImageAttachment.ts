import { ChangeEvent, useRef } from "react";
import { useImgCrop } from "../lib/hooks/useImgCrop";
import {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { MessageSchemaType } from "@/features/send-message/model/zod/message.schema";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  setImgSrc,
  setIsOpen,
  setRawFile,
} from "@/features/image-viewer/model/store/image.store";

export const useImageAttachment = (
  setValue: UseFormSetValue<MessageSchemaType>,
  setError: UseFormSetError<MessageSchemaType>,
  clearErrors: UseFormClearErrors<MessageSchemaType>,
) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dispatch = useDispatch();
  const { rawFile, completedCrop } = useSelector(
    (state: RootState) => state.imageViewer,
  );

  const { cropImage } = useImgCrop({
    completedCrop,
    imgRef: imgRef.current,
    rawFile,
  });
  const MAX_FILE_SIZE = 500 * 1024;
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const file = files[0];

    const preview = URL.createObjectURL(file);
    dispatch(setImgSrc(preview));
    dispatch(setIsOpen(true));
    dispatch(setRawFile(file));

    if (!file.type.startsWith("image/")) {
      setError("images", {
        type: "manual",
        message: "Можно только изображения",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("images", {
        type: "manual",
        message: "Файл слишком большой (макс. 500KB)",
      });
      return;
    }

    setValue("images", [file]);
    clearErrors("images");

    e.target.value = "";
  };

  const onCropComplete = async () => {
    const croppedFile = await cropImage();
    if (!croppedFile) return;
    setValue("images", [croppedFile]);
    setIsOpen(false);
  };

  return {
    handleFileChange,
    onCropComplete,
    imgRef,
  };
};
