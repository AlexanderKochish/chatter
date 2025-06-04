import { messageSchema, MessageSchemaType } from "../zod/message.schema";
import { ChangeEvent, useRef } from "react";
import { useSendMessage } from "./useSendMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useImgCrop } from "@shared/lib/hooks/useImgCrop";
import { useAutosizeTextarea } from "@shared/hooks/useAutosizeTextarea";
import { useProfile } from "@shared/api/queries/useProfile";
import { useImageCropStore } from "@shared/model/store/imageCrop.store";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { EmojiClickData } from "emoji-picker-react";

export const useChatFormLogic = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery('chatId')
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { sendMessage } = useSendMessage();
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

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<MessageSchemaType>({
      defaultValues: {
        text: "",
        roomId: "",
        ownerId: "",
      },
      resolver: zodResolver(messageSchema),
    });
  const textMessage = watch("text");
  useAutosizeTextarea(textAreaRef, textMessage);

  const { cropImage } = useImgCrop({
    completedCrop,
    imgRef: imgRef.current,
    rawFile,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImgSrc(previewUrl);
    setIsOpen(true);

    setRawFile(file);
    e.target.value = "";
  };

  const onCropComplete = async () => {
    const croppedFile = await cropImage();
    if (!croppedFile) return;
    setValue("images", [croppedFile]);
    setIsOpen(false);
  };

  const text = watch("text");
  const handleEmojiClick = (data: EmojiClickData) => {
    console.log(data)
    const newValue = text + data.emoji;
    setValue("text", newValue);
  };

  const onSubmit = async (data: MessageSchemaType) => {
    if (!me.id) return;
    const message = {
      roomId,
      ownerId: me?.id,
      text: data.text,
      images: data.images ?? [],
    };
    await sendMessage(message as MessageSchemaType);
    reset();
  };

  return {
    formProps: {
      register,
      handleSubmit: handleSubmit(onSubmit),
      textAreaRef,
      setValue,
      watch,
    },
    cropProps: {
      crop,
      setCrop,
      imgSrc,
      isOpen,
      setIsOpen,
      setCompletedCrop,
      handleFileChange,
      onCropComplete,
      imgRef,
    },
    fileInputProps: {
      handleFileChange,
    },
    emoji: {
      handleEmojiClick
    }
  };
};
