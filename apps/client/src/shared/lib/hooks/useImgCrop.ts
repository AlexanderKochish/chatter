import { PixelCrop } from "react-image-crop";

export const useImgCrop = ({
  completedCrop,
  imgRef,
  rawFile,
}: {
  completedCrop: PixelCrop | undefined;
  imgRef: HTMLImageElement | null;
  rawFile: File | null;
}) => {
  const cropImage = async (): Promise<File | null> => {
    if (!completedCrop || !imgRef || !rawFile) return null;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;

    canvas.width = completedCrop.width!;
    canvas.height = completedCrop.height!;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      imgRef,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);

        const croppedFile = new File([blob], rawFile.name, {
          type: rawFile.type,
        });
        resolve(croppedFile);
      }, rawFile.type);
    });
  };

  return { cropImage };
};
