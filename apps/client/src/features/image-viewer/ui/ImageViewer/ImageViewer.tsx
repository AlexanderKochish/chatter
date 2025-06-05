import { useChatFormLogic } from "@/features/send-message/model/hooks/useChatFormLogic";
import CropFileModal from "@/features/send-message/ui/CropFileModal/CropFileModal";
import ReactCrop from "react-image-crop";

const ImageViewer = () => {
  const {
    cropProps: {
      crop,
      imgSrc,
      isOpen,
      onCropComplete,
      setCompletedCrop,
      setCrop,
      setIsOpen,
      imgRef,
    },
  } = useChatFormLogic();
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
          <img ref={imgRef} alt="Crop me" src={imgSrc} />
        </ReactCrop>
      )}
      <div>
        <input type="text" />
        <button onClick={onCropComplete}>Send</button>
      </div>
    </CropFileModal>
  );
};

export default ImageViewer;
