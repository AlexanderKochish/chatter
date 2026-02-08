import clsx from "clsx";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import s from "./Slider.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@shared/assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { resetZoom } from "@/features/image-viewer/model/store/image.store";

type Props = {
  slides: Array<{ id: string; url: string; messageId: string }>;
  className?: string;
  initialSlide?: number;
};

export const Slider = ({ slides, className = "", initialSlide }: Props) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: initialSlide,
  });
  const dispatch = useDispatch();
  const zoom = useSelector((state: RootState) => state.imageViewer.zoom);
  const handlerResetZoom = () => dispatch(resetZoom());

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
          handlerResetZoom();
        }}
      >
        <ChevronLeftIcon width="50" height="50" />
      </button>
      <button
        className={clsx(s.arrow, s.right)}
        aria-label="Next Slide"
        onClick={() => {
          slider.current?.next();
          handlerResetZoom();
        }}
      >
        <ChevronRightIcon width="50" height="50" />
      </button>
    </div>
  );
};
