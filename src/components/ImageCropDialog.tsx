import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
  useImageCrop,
} from "@/components/ui/image-crop"

interface Props {
  file: File | null
  aspect: number
  circular?: boolean
  /** Max size in bytes of the cropped file. */
  maxBytes: number
  /** Max length in px of the longest side of the cropped image. */
  maxOutputSize: number
  onCancel: () => void
  /** May throw: the message is displayed in the dialog and the user can adjust the crop. */
  onCrop: (file: File) => void | Promise<void>
}

function ApplyButton() {
  const { isApplying } = useImageCrop()
  return (
    <ImageCropApply asChild>
      <Button type="button">
        {isApplying && <Loader2 className="animate-spin" />}
        {isApplying ? "Applying..." : "Apply"}
      </Button>
    </ImageCropApply>
  )
}

export function ImageCropDialog({ file, aspect, circular, maxBytes, maxOutputSize, onCancel, onCrop }: Props) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
  }, [file])

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>

        {file && (
          <ImageCrop
            file={file}
            aspect={aspect}
            circularCrop={circular}
            maxImageSize={maxBytes}
            maxOutputSize={maxOutputSize}
            onChange={() => setError(null)}
            onCrop={onCrop}
            onError={(e) => setError(e.message)}
          >
            <ImageCropContent className="mx-auto max-h-80" />

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter className="items-center sm:justify-between">
              <ImageCropReset />
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <ApplyButton />
              </div>
            </DialogFooter>
          </ImageCrop>
        )}
      </DialogContent>
    </Dialog>
  )
}
