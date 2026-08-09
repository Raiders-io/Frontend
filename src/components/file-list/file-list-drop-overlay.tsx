type FileListDropOverlayProps = {
  visible: boolean
}

export default function FileListDropOverlay({ visible }: FileListDropOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="max-w-md rounded-2xl border border-dashed border-primary bg-background p-8 text-center shadow-xl">
        <p className="text-lg font-semibold">Drop your files here</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Multiple file types are supported, upload will start automatically.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Formats: txt, pdf, md, tex.
        </p>
      </div>
    </div>
  )
}
