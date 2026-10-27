import { CropIcon, RotateCcwIcon } from "lucide-react";
import { Slot } from "radix-ui";
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type ReactCropProps,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/lib/shadcn";

import "react-image-crop/dist/ReactCrop.css";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const DEFAULT_MAX_OUTPUT_SIZE = 2048;
const OUTPUT_TYPE = "image/webp";
const QUALITY_STEPS = [0.92, 0.85, 0.75, 0.65];
const MAX_DOWNSCALE_ATTEMPTS = 8;
const DOWNSCALE_FACTOR = 0.8;

const MIN_CROP_PERCENT = 5;
const WHEEL_ZOOM_SPEED = 0.0015;

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): PercentCrop =>
  centerCrop(
    aspect
      ? makeAspectCrop(
          { unit: "%", width: 90 },
          aspect,
          mediaWidth,
          mediaHeight
        )
      : { x: 0, y: 0, width: 90, height: 90, unit: "%" },
    mediaWidth,
    mediaHeight
  );

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const baseName = (name: string) => name.replace(/\.[^/.]+$/, "") || "image";

/** Scale a crop around its center, keeping its ratio and staying in the image. */
const scaleCrop = (crop: PercentCrop, factor: number): PercentCrop => {
  const { width, height } = crop;
  if (width <= 0 || height <= 0) {
    return crop;
  }

  const minScale = Math.min(
    1,
    Math.max(MIN_CROP_PERCENT / width, MIN_CROP_PERCENT / height)
  );
  const maxScale = Math.min(100 / width, 100 / height);
  if (minScale > maxScale) {
    return crop;
  }

  const scale = Math.min(maxScale, Math.max(minScale, factor));
  const newWidth = width * scale;
  const newHeight = height * scale;
  const centerX = crop.x + width / 2;
  const centerY = crop.y + height / 2;

  return {
    ...crop,
    unit: "%",
    x: Math.min(100 - newWidth, Math.max(0, centerX - newWidth / 2)),
    y: Math.min(100 - newHeight, Math.max(0, centerY - newHeight / 2)),
    width: newWidth,
    height: newHeight,
  };
};

type CropToFileOptions = {
  image: HTMLImageElement;
  crop: PercentCrop;
  fileName: string;
  maxBytes: number;
  maxOutputSize: number;
};

/**
 * Crops the image on its *natural* resolution (independent from the size it is
 * displayed at), caps the longest side to `maxOutputSize`, then encodes it
 * (WebP, quality ladder, then progressive downscale) until it fits `maxBytes`.
 * The loop is bounded: it always terminates, either with a File or an Error.
 */
const cropToFile = async ({
  image,
  crop,
  fileName,
  maxBytes,
  maxOutputSize,
}: CropToFileOptions): Promise<File> => {
  const { naturalWidth, naturalHeight } = image;

  const sx = Math.max(0, Math.round((crop.x / 100) * naturalWidth));
  const sy = Math.max(0, Math.round((crop.y / 100) * naturalHeight));
  const sw = Math.max(
    1,
    Math.min(naturalWidth - sx, Math.round((crop.width / 100) * naturalWidth))
  );
  const sh = Math.max(
    1,
    Math.min(naturalHeight - sy, Math.round((crop.height / 100) * naturalHeight))
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Your browser cannot process this image.");
  }

  let scale = Math.min(1, maxOutputSize / Math.max(sw, sh));

  for (let attempt = 0; attempt < MAX_DOWNSCALE_ATTEMPTS; attempt++) {
    // Resizing a canvas resets its context state, so configure it every time.
    canvas.width = Math.max(1, Math.round(sw * scale));
    canvas.height = Math.max(1, Math.round(sh * scale));
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, OUTPUT_TYPE, quality);
      if (!blob) {
        throw new Error("Unable to export the cropped image.");
      }
      if (blob.size <= maxBytes) {
        const extension = EXTENSIONS[blob.type] ?? "png";
        return new File([blob], `${baseName(fileName)}.${extension}`, {
          type: blob.type,
        });
      }
      // Browsers that cannot encode WebP fall back to PNG, which ignores quality.
      if (blob.type === "image/png") {
        break;
      }
    }

    scale *= DOWNSCALE_FACTOR;
  }

  throw new Error(
    "The image is still too heavy after compression. Select a smaller area."
  );
};

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

type ImageCropContextType = {
  file: File;
  imgSrc: string;
  crop: PercentCrop | undefined;
  imgRef: RefObject<HTMLImageElement | null>;
  isApplying: boolean;
  reactCropProps: Omit<ReactCropProps, "onChange" | "onComplete" | "children">;
  handleChange: ReactCropProps["onChange"];
  handleComplete: NonNullable<ReactCropProps["onComplete"]>;
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
  applyCrop: () => Promise<void>;
  resetCrop: () => void;
  /** factor < 1 zooms in (smaller area), factor > 1 zooms out. */
  zoomCrop: (factor: number) => void;
};

const ImageCropContext = createContext<ImageCropContextType | null>(null);

export const useImageCrop = () => {
  const context = useContext(ImageCropContext);
  if (!context) {
    throw new Error("ImageCrop components must be used within ImageCrop");
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export type ImageCropProps = {
  file: File;
  /** Max size in bytes of the produced file. */
  maxImageSize?: number;
  /** Max length in px of the longest side of the produced image. */
  maxOutputSize?: number;
  /** Called with the cropped file. May throw: the error goes to `onError`. */
  onCrop?: (croppedFile: File) => void | Promise<void>;
  onError?: (error: Error) => void;
  children: ReactNode;
  onChange?: ReactCropProps["onChange"];
  onComplete?: ReactCropProps["onComplete"];
} & Omit<ReactCropProps, "onChange" | "onComplete" | "children">;

export const ImageCrop = ({
  file,
  maxImageSize = DEFAULT_MAX_IMAGE_SIZE,
  maxOutputSize = DEFAULT_MAX_OUTPUT_SIZE,
  onCrop,
  onError,
  children,
  onChange,
  onComplete,
  ...reactCropProps
}: ImageCropProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null);
  const [initialCrop, setInitialCrop] = useState<PercentCrop>();
  const [isApplying, setIsApplying] = useState(false);

  // Object URL: instant, no base64 copy in memory, revoked on cleanup.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const newCrop = centerAspectCrop(width, height, reactCropProps.aspect);
      setCrop(newCrop);
      setInitialCrop(newCrop);
      // The default selection is immediately applicable, even if the user
      // never touches the crop box.
      setCompletedCrop(newCrop);
    },
    [reactCropProps.aspect]
  );

  const handleChange: ReactCropProps["onChange"] = (pixelCrop, percentCrop) => {
    setCrop(percentCrop);
    onChange?.(pixelCrop, percentCrop);
  };

  const handleComplete: NonNullable<ReactCropProps["onComplete"]> = (
    pixelCrop,
    percentCrop
  ) => {
    setCompletedCrop(percentCrop);
    onComplete?.(pixelCrop, percentCrop);
  };

  const applyCrop = async () => {
    const image = imgRef.current;
    if (!(image && completedCrop) || isApplying) {
      return;
    }

    setIsApplying(true);
    try {
      const croppedFile = await cropToFile({
        image,
        crop: completedCrop,
        fileName: file.name,
        maxBytes: maxImageSize,
        maxOutputSize,
      });
      await onCrop?.(croppedFile);
    } catch (error) {
      onError?.(
        error instanceof Error ? error : new Error("Failed to crop the image.")
      );
    } finally {
      setIsApplying(false);
    }
  };

  const resetCrop = () => {
    if (initialCrop) {
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
    }
  };

  // factor < 1 zooms in (smaller area), factor > 1 zooms out.
  const zoomCrop = useCallback((factor: number) => {
    setCrop((prev) => (prev ? scaleCrop(prev, factor) : prev));
    setCompletedCrop((prev) => (prev ? scaleCrop(prev, factor) : prev));
  }, []);

  const contextValue: ImageCropContextType = {
    file,
    imgSrc,
    crop,
    imgRef,
    isApplying,
    reactCropProps: { keepSelection: true, ...reactCropProps },
    handleChange,
    handleComplete,
    onImageLoad,
    applyCrop,
    resetCrop,
    zoomCrop,
  };

  return (
    <ImageCropContext.Provider value={contextValue}>
      {children}
    </ImageCropContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

export type ImageCropContentProps = {
  style?: CSSProperties;
  className?: string;
  /** Zoom the selection with the mouse wheel / trackpad pinch. */
  wheelZoom?: boolean;
};

export const ImageCropContent = ({
  style,
  className,
  wheelZoom = true,
}: ImageCropContentProps) => {
  const {
    imgSrc,
    crop,
    handleChange,
    handleComplete,
    onImageLoad,
    imgRef,
    reactCropProps,
    isApplying,
    zoomCrop,
  } = useImageCrop();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Native listener: React's onWheel is passive and cannot preventDefault,
  // so the page would scroll while zooming.
  useEffect(() => {
    const element = wrapperRef.current;
    if (!(element && wheelZoom) || isApplying) {
      return;
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomCrop(Math.exp(delta * WHEEL_ZOOM_SPEED));
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [wheelZoom, isApplying, zoomCrop]);

  const shadcnStyle = {
    "--rc-border-color": "var(--color-border)",
    "--rc-focus-color": "var(--color-primary)",
  } as CSSProperties;

  return (
    <div className="contents" ref={wrapperRef}>
      <ReactCrop
        className={cn("max-h-[277px] max-w-full", className)}
        crop={crop}
        onChange={handleChange}
        onComplete={handleComplete}
        style={{ ...shadcnStyle, ...style }}
        {...reactCropProps}
      >
        {imgSrc && (
          <img
            alt="Image to crop"
            className="block max-h-[inherit] max-w-full"
            onLoad={onImageLoad}
            ref={imgRef}
            src={imgSrc}
          />
        )}
      </ReactCrop>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Actions                                                                    */
/* -------------------------------------------------------------------------- */

export type ImageCropApplyProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const ImageCropApply = ({
  asChild = false,
  children,
  onClick,
  disabled,
  ...props
}: ImageCropApplyProps) => {
  const { applyCrop, isApplying } = useImageCrop();

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    await applyCrop();
  };

  const isDisabled = disabled || isApplying;

  if (asChild) {
    return (
      <Slot.Root {...{ disabled: isDisabled }} onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <CropIcon className="size-4" />}
    </Button>
  );
};

export type ImageCropResetProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

export const ImageCropReset = ({
  asChild = false,
  children,
  onClick,
  disabled,
  ...props
}: ImageCropResetProps) => {
  const { resetCrop, isApplying } = useImageCrop();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    resetCrop();
    onClick?.(e);
  };

  const isDisabled = disabled || isApplying;

  if (asChild) {
    return (
      <Slot.Root {...{ disabled: isDisabled }} onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <Button
      aria-label="Reset crop"
      disabled={isDisabled}
      onClick={handleClick}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <RotateCcwIcon className="size-4" />}
    </Button>
  );
};
