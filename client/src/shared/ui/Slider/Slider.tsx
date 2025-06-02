import clsx from "clsx";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import s from "./Slider.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@shared/assets/icons";
import { useZoomStore } from "@/features/image-viewer/model/store/zoom.store";

type Props = {
  slides: Array<{ id: string; url: string; messageId: string }>;
  className?: string;
  initialSlide?: number;
};

export const Slider = ({ slides, className = "", initialSlide }: Props) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: initialSlide,
  });
  const zoom = useZoomStore((state) => state.zoom);
  const resetZoom = useZoomStore((state) => state.resetZoom);

  return (
    <div ref={sliderRef} className={clsx(s.sliderWrapper, className)}>
      {slides?.map(({ url, id }) => (
        <div key={id} className="keen-slider__slide">
          <div className={s.imageWrapper}>
            <img
              className={s.img}
              src={url}
              alt="chat"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>
      ))}

      <button
        className={clsx(s.arrow, s.left)}
        aria-label="Previous Slide"
        onClick={() => {
          slider.current?.prev();
          resetZoom();
        }}
      >
        <ChevronLeftIcon width="50" height="50" />
      </button>
      <button
        className={clsx(s.arrow, s.right)}
        aria-label="Next Slide"
        onClick={() => {
          slider.current?.next();
          resetZoom();
        }}
      >
        <ChevronRightIcon width="50" height="50" />
      </button>
    </div>
  );
};
