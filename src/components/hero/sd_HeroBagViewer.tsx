import { useEffect, useMemo, useRef } from "react";

interface sd_HeroBagViewerProps {
  frameCount?: number;
  durationMs?: number;
  frameDirectory?: string;
  framePrefix?: string;
  frameExtension?: string;
  framePadLength?: number;
  className?: string;
}

export const SdHeroBagViewer = ({
  frameCount = 240,
  durationMs = 8000,
  frameDirectory = "/cadr-hero-block",
  framePrefix = "ezgif-frame-",
  frameExtension = "png",
  framePadLength = 3,
  className
}: sd_HeroBagViewerProps): JSX.Element => {
  const sd_canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sd_animationFrameRef = useRef<number | null>(null);
  const sd_startTimeRef = useRef<number>(0);
  const sd_currentFrameRef = useRef<number>(0);
  const sd_framesRef = useRef<HTMLImageElement[]>([]);
  const sd_resizeObserverRef = useRef<ResizeObserver | null>(null);

  const sd_composedClassName = className
    ? `sd_hero__bag_frame ${className}`
    : "sd_hero__bag_frame";

  const sd_frameSources = useMemo(() => {
    return Array.from({ length: frameCount }, (_, sd_index) => {
      const sd_number = String(sd_index + 1).padStart(framePadLength, "0");
      return `${frameDirectory}/${framePrefix}${sd_number}.${frameExtension}`;
    });
  }, [frameCount, frameDirectory, frameExtension, framePadLength, framePrefix]);

  useEffect(() => {
    const sd_canvas = sd_canvasRef.current;
    if (!sd_canvas) {
      return;
    }

    const sd_context = sd_canvas.getContext("2d", { alpha: true });
    if (!sd_context) {
      return;
    }

    let sd_isUnmounted = false;

    const sd_resizeCanvas = (): void => {
      const sd_rect = sd_canvas.getBoundingClientRect();
      const sd_dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sd_targetWidth = Math.max(1, Math.round(sd_rect.width * sd_dpr));
      const sd_targetHeight = Math.max(1, Math.round(sd_rect.height * sd_dpr));

      if (sd_canvas.width !== sd_targetWidth || sd_canvas.height !== sd_targetHeight) {
        sd_canvas.width = sd_targetWidth;
        sd_canvas.height = sd_targetHeight;
      }
    };

    const sd_drawFrame = (sd_frameIndex: number): void => {
      const sd_frame = sd_framesRef.current[sd_frameIndex];
      if (!sd_frame || !sd_frame.complete || sd_frame.naturalWidth === 0) {
        return;
      }

      sd_context.clearRect(0, 0, sd_canvas.width, sd_canvas.height);

      const sd_scale = Math.min(
        sd_canvas.width / sd_frame.naturalWidth,
        sd_canvas.height / sd_frame.naturalHeight
      );
      const sd_drawWidth = sd_frame.naturalWidth * sd_scale;
      const sd_drawHeight = sd_frame.naturalHeight * sd_scale;
      const sd_drawX = (sd_canvas.width - sd_drawWidth) / 2;
      const sd_drawY = (sd_canvas.height - sd_drawHeight) / 2;

      sd_context.drawImage(sd_frame, sd_drawX, sd_drawY, sd_drawWidth, sd_drawHeight);
    };

    const sd_tick = (sd_timestamp: number): void => {
      if (sd_isUnmounted) {
        return;
      }

      if (sd_startTimeRef.current === 0) {
        sd_startTimeRef.current = sd_timestamp;
      }

      const sd_elapsed = (sd_timestamp - sd_startTimeRef.current) % durationMs;
      const sd_progress = sd_elapsed / durationMs;
      const sd_frameIndex = Math.min(frameCount - 1, Math.floor(sd_progress * frameCount));

      if (sd_frameIndex !== sd_currentFrameRef.current) {
        sd_currentFrameRef.current = sd_frameIndex;
      }

      sd_drawFrame(sd_currentFrameRef.current);
      sd_animationFrameRef.current = window.requestAnimationFrame(sd_tick);
    };

    sd_framesRef.current = sd_frameSources.map((sd_source, sd_index) => {
      const sd_image = new Image();
      sd_image.decoding = "async";
      sd_image.src = sd_source;
      sd_image.onload = (): void => {
        if (sd_isUnmounted || sd_index !== 0) {
          return;
        }
        sd_resizeCanvas();
        sd_drawFrame(0);
      };
      return sd_image;
    });

    sd_resizeCanvas();

    sd_resizeObserverRef.current = new ResizeObserver(() => {
      sd_resizeCanvas();
      sd_drawFrame(sd_currentFrameRef.current);
    });
    sd_resizeObserverRef.current.observe(sd_canvas);

    window.addEventListener("resize", sd_resizeCanvas);
    sd_animationFrameRef.current = window.requestAnimationFrame(sd_tick);

    return () => {
      sd_isUnmounted = true;
      window.removeEventListener("resize", sd_resizeCanvas);
      sd_resizeObserverRef.current?.disconnect();
      if (sd_animationFrameRef.current !== null) {
        window.cancelAnimationFrame(sd_animationFrameRef.current);
      }
    };
  }, [durationMs, frameCount, sd_frameSources]);

  return (
    <div className={sd_composedClassName}>
      <canvas
        ref={sd_canvasRef}
        className="sd_hero__bag_canvas"
        aria-label="Анимация футуристичной сумки HUSH"
      />
    </div>
  );
};
