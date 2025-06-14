import { useGetChatImagesQuery } from "@/features/image-viewer/api/image.api";
import { useEffect, useState } from "react";

export const useImageModal = (roomId: string) => {
  const { data: roomImages } = useGetChatImagesQuery(roomId);
  const [isOpen, setIsOpen] = useState(false);
  const [, setImageId] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const handleOpenModal = (id: string) => {
    const index = roomImages?.findIndex((img: { id: string }) => img.id === id);
    const safeIndex = index !== undefined && index !== -1 ? index : 0;
    setImageIndex(safeIndex);
    setImageId(id);
    setIsOpen(true);
  };
  const resetModal = () => {
    setIsOpen(false);
    setImageIndex(0);
    setImageId("");
  };

  useEffect(() => {
    resetModal();
  }, [roomImages?.length]);

  return {
    handleOpenModal,
    resetModal,
    isOpen,
    imageIndex,
    setImageId,
    setImageIndex,
    setIsOpen,
    roomImages,
  };
};
