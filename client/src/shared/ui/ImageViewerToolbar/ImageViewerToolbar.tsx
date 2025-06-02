import { useZoomStore } from "@/features/image-viewer/model/store/zoom.store";
import s from "./ImageViewerToolbar.module.css";
import {
  CloseIcon,
  DownloadIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@shared/assets/icons";
import { handleDownloadImage } from "@shared/lib/helpers/downloadImage";
import { MessageImage } from "@shared/types";

type Props = {
  imageIndex: number;
  roomImages: MessageImage[];
  onModalReset: () => void;
};

const ImageViewerToolbar = ({
  imageIndex,
  roomImages,
  onModalReset,
}: Props) => {
  const zoom = useZoomStore((state) => state.zoom);
  const setZoom = useZoomStore((state) => state.setZoom);
  const resetZoom = useZoomStore((state) => state.resetZoom);

  const zoomIn = () => setZoom(Math.min(zoom + 0.2, 3));
  const zoomOut = () => setZoom(Math.max(zoom - 0.2, 1));

  const handleReset = () => {
    resetZoom();
    onModalReset();
  };

  return (
    <ul className={s.imageSetting}>
      <li>
        <button
          className={s.btn}
          onClick={() => {
            if (roomImages?.[imageIndex]?.url) {
              handleDownloadImage(roomImages[imageIndex].url);
            }
          }}
        >
          <DownloadIcon width="35" height="35" />
        </button>
      </li>
      <li>
        <button className={s.btn} onClick={zoomIn}>
          <ZoomInIcon width="35" height="35" />
        </button>
      </li>
      <li>
        <button className={s.btn} onClick={zoomOut}>
          <ZoomOutIcon width="35" height="35" />
        </button>
      </li>
      <li>
        <button className={s.btn} onClick={handleReset}>
          <CloseIcon width="30" height="30" />
        </button>
      </li>
    </ul>
  );
};

export default ImageViewerToolbar;
