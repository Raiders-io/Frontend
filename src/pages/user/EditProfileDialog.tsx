import { useEffect, useState } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDropzone } from "react-dropzone"
import Editor from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { Camera, Loader2, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/user/UserAvatar"
import { UserBackground } from "@/components/user/UserBackground"
import { UsernameField, useUsernameStatus } from "@/components/user/UsernameField"
import { ImageCropDialog } from "@/components/ImageCropDialog"
import { isThemeDark } from "@/components/theme-provider"
import { useUpdateMe } from "@/services/user/user_queries"
import { cn } from "@/utils/lib/shadcn"
import { usernameSchema } from "@/utils/types/common"
import type { PrivateProfile, UpdateMePayload } from "@/utils/types/user"
import { getErrorMessage } from "./utils"

/* ------------------------------ Image limits ------------------------------ */
/*
 * Backend: 2 MB max, 200x200 min (avatar) / 600x200 min (background),
 * 5000 px max, jpg/png/webp. The front accepts big source files, then the
 * crop step produces a file that always respects the backend limits
 * (size, max dimensions, format). Server-side output is 512 / 1200x400.
 */
const IMAGE_RAW_MAX_BYTES = 15 * 1024 * 1024
const IMAGE_MAX_BYTES = Math.floor(1.9 * 1024 * 1024) // backend limit 2 MB, with margin
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const ACCEPT = Object.fromEntries(IMAGE_TYPES.map((type) => [type, [] as string[]]))
const IMAGE_FORMAT_ERROR = "Accepted formats: JPG, PNG, WebP"
const IMAGE_SIZE_ERROR = "Maximum 15 MB"

const AVATAR_ASPECT = 1
const AVATAR_MIN_SIZE = { width: 200, height: 200 }
const AVATAR_MAX_OUTPUT = 1024 // above the 512 px output, below the 5000 px limit

const BACKGROUND_ASPECT = 3
const BACKGROUND_MIN_SIZE = { width: 600, height: 200 }
const BACKGROUND_MAX_OUTPUT = 2400 // 2400x800, above the 1200x400 output

const BIO_MAX_LENGTH = 5000

const BIO_MIN_HEIGHT = 96
const BIO_MAX_HEIGHT = 320

const BIO_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineNumbers: "off",
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 0,
  renderLineHighlight: "none",
  overviewRulerLanes: 0,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  scrollBeyondLastLine: false,
  stickyScroll: { enabled: false },
  guides: { indentation: false },
  bracketPairColorization: { enabled: false },
  matchBrackets: "never",
  renderWhitespace: "none",

  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  wordBasedSuggestions: "off",
  parameterHints: { enabled: false },
  hover: { enabled: "off" },
  occurrencesHighlight: "off",
  selectionHighlight: false,
  links: false,
  contextmenu: false,
  unicodeHighlight: { ambiguousCharacters: false },

  wordWrap: "on",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
  fontSize: 14,
  lineHeight: 22,
  padding: { top: 10, bottom: 10 },

  scrollbar: {
    verticalScrollbarSize: 8,
    useShadows: false,
    alwaysConsumeMouseWheel: false,
  },
  smoothScrolling: true,
  automaticLayout: true,
  ariaLabel: "Bio",
}

/** Monaco editor that grows with its content, between BIO_MIN_HEIGHT and BIO_MAX_HEIGHT. */
function BioEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [height, setHeight] = useState(BIO_MIN_HEIGHT)

  return (
    <Editor
      height={height}
      language="markdown"
      theme={isThemeDark() ? "vs-dark" : "light"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      loading={<Loader2 className="size-4 animate-spin text-muted-foreground" />}
      options={BIO_EDITOR_OPTIONS}
      onMount={(ed) => {
        const update = () =>
          setHeight(Math.min(Math.max(ed.getContentHeight(), BIO_MIN_HEIGHT), BIO_MAX_HEIGHT))
        ed.onDidContentSizeChange(update)
        update()
      }}
    />
  )
}

/* --------------------------------- Schema --------------------------------- */

type MinSize = { width: number; height: number }

const schema = z.object({
  username: usernameSchema,
  firstname: z.string().trim().max(30, "Maximum 30 characters").optional().or(z.literal("")),
  lastname: z.string().trim().max(30, "Maximum 30 characters").optional().or(z.literal("")),
  bio: z.string().trim().max(BIO_MAX_LENGTH, `Maximum ${BIO_MAX_LENGTH} characters`).optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

function toDefaults(user: PrivateProfile): FormValues {
  return {
    username: user.username,
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    bio: user.bio ?? "",
  }
}

/** Returns an error description if the image is smaller than `min`, otherwise null. */
async function checkSize(file: File, min?: MinSize) {
  if (!min) return null
  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap
    bitmap.close()
    if (width >= min.width && height >= min.height) return null
    return `${width}×${height}px, minimum ${min.width}×${min.height}px`
  } catch {
    return "unreadable file"
  }
}

function useImagePicker(min?: MinSize) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [source, setSource] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Revoke the previous object URL whenever it changes or on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function clear() {
    setFile(null)
    setPreview(null)
    setSource(null)
    setError(null)
  }

  async function pick(next?: File) {
    if (!next) return
    if (!IMAGE_TYPES.includes(next.type)) return setError(IMAGE_FORMAT_ERROR)
    if (next.size > IMAGE_RAW_MAX_BYTES) return setError(IMAGE_SIZE_ERROR)
    const sizeIssue = await checkSize(next, min)
    if (sizeIssue) return setError(`Image too small: ${sizeIssue}`)
    setError(null)
    setSource(next)
  }

  /** Throws if the crop is invalid: the crop dialog stays open and shows the message. */
  async function confirmCrop(cropped: File) {
    const sizeIssue = await checkSize(cropped, min)
    if (sizeIssue) {
      throw new Error(`Selected area too small: ${sizeIssue}`)
    }
    setError(null)
    setFile(cropped)
    setPreview(URL.createObjectURL(cropped))
    setSource(null)
  }

  const dropzone = useDropzone({
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
    maxSize: IMAGE_RAW_MAX_BYTES,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: (files) => pick(files[0]),
    onDropRejected: (rejections) => {
      const codes = rejections[0]?.errors.map((e) => e.code) ?? []
      if (codes.includes("file-too-large")) setError(IMAGE_SIZE_ERROR)
      else if (codes.includes("too-many-files")) setError("Drop a single image")
      else setError(IMAGE_FORMAT_ERROR)
    },
  })

  return {
    file,
    preview,
    error,
    source,
    dropzone,
    clear,
    cancelCrop: () => setSource(null),
    confirmCrop,
  }
}

export function EditProfileDialog({ me }: { me: PrivateProfile }) {
  const updateMe = useUpdateMe()
  const [open, setOpen] = useState(false)
  const avatar = useImagePicker(AVATAR_MIN_SIZE)
  const background = useImagePicker(BACKGROUND_MIN_SIZE)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: toDefaults(me),
  })
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = form

  const username = useWatch({ control: form.control, name: "username" })
  const { canSubmit: usernameOk } = useUsernameStatus(username ?? "", me.username)

  const cropping = !!avatar.source || !!background.source
  const bg = background.dropzone
  const av = avatar.dropzone

  function handleOpenChange(next: boolean) {
    if (!next && cropping) return
    setOpen(next)
    if (next) reset(toDefaults(me))
    else {
      avatar.clear()
      background.clear()
    }
  }

  const onSubmit = async (values: FormValues) => {
    const payload: UpdateMePayload = {}
    const nullableFields = ["firstname", "lastname", "bio"] as const

    for (const key of nullableFields) {
      if (dirtyFields[key]) {
        payload[key] = values[key] === "" ? null : values[key]
      }
    }

    if (dirtyFields.username) payload.username = values.username
    if (avatar.file) payload.avatar = avatar.file
    if (background.file) payload.background = background.file

    if (Object.keys(payload).length === 0) {
      handleOpenChange(false)
      return
    }

    try {
      await updateMe.mutateAsync(payload)
      handleOpenChange(false)
    } catch (e) {
      setError("root", { message: getErrorMessage(e, "Failed to update profile") })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Pencil />
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent
          className="flex max-h-[90dvh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
          onInteractOutside={(e) => {
            if (cropping) e.preventDefault()
          }}
        >
          <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>This information is visible to other users.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <FieldGroup className="gap-5">
                  <div className="space-y-2">
                    <div className="relative">
                      <div {...bg.getRootProps()} className="relative">
                        <input {...bg.getInputProps()} />
                        <UserBackground
                          user={me}
                          src={background.preview}
                          className="aspect-3/1 w-full rounded-lg"
                        />

                        {bg.isDragActive && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-background/70 text-sm font-medium">
                            Drop your background here
                          </div>
                        )}

                        <div className="absolute right-2 top-2 flex gap-1.5">
                          {background.file && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon-sm"
                              className="size-8"
                              onClick={background.clear}
                              aria-label="Cancel background change"
                            >
                              <X />
                            </Button>
                          )}
                          <Button type="button" variant="secondary" size="sm" onClick={bg.open}>
                            <Camera />
                            <span className="max-sm:sr-only">Change background</span>
                          </Button>
                        </div>
                      </div>

                      <div
                        {...av.getRootProps()}
                        className={cn(
                          "absolute -bottom-9 left-4 rounded-full ring-4 ring-background",
                          av.isDragActive && "ring-primary"
                        )}
                      >
                        <input {...av.getInputProps()} />
                        <button
                          type="button"
                          onClick={av.open}
                          aria-label="Change photo"
                          className="group relative block cursor-pointer rounded-full"
                        >
                          <UserAvatar user={me} src={avatar.preview} className="size-18" />
                          <span
                            className={cn(
                              "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                              av.isDragActive && "opacity-100"
                            )}
                          >
                            <Camera className="size-5" />
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-10">
                      <p className="text-xs text-muted-foreground">
                        Drop an image on the banner or the photo. JPG, PNG or WebP, 15 MB max, compressed
                        automatically. Photo: 200×200 px min. Banner: 3:1 ratio, 600×200 px min.
                      </p>
                      {avatar.error && <FieldError>{avatar.error}</FieldError>}
                      {background.error && <FieldError>{background.error}</FieldError>}
                    </div>
                  </div>

                  <UsernameField current={me.username} />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3">
                    <Field data-invalid={!!errors.firstname}>
                      <FieldLabel htmlFor="firstname">First name</FieldLabel>
                      <Input id="firstname" aria-invalid={!!errors.firstname} {...register("firstname")} />
                      <FieldError errors={[errors.firstname]} />
                    </Field>
                    <Field data-invalid={!!errors.lastname}>
                      <FieldLabel htmlFor="lastname">Last name</FieldLabel>
                      <Input id="lastname" aria-invalid={!!errors.lastname} {...register("lastname")} />
                      <FieldError errors={[errors.lastname]} />
                    </Field>
                  </div>

                  <Controller
                    name="bio"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const length = field.value?.length ?? 0
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="bio">Bio</FieldLabel>
                            <span
                              className={cn(
                                "text-xs tabular-nums",
                                length > BIO_MAX_LENGTH ? "font-medium text-destructive" : "text-muted-foreground"
                              )}
                            >
                              {length}/{BIO_MAX_LENGTH}
                            </span>
                          </div>

                          {/* Small screens: native textarea */}
                          <Textarea
                            {...field}
                            id="bio"
                            rows={4}
                            aria-invalid={fieldState.invalid}
                            className="max-h-32 resize-none overflow-y-auto sm:hidden"
                          />

                          {/* From sm: Monaco, auto-growing */}
                          <div
                            className={cn(
                              "hidden overflow-hidden rounded-md border sm:block",
                              fieldState.invalid && "border-destructive"
                            )}
                          >
                            <BioEditor value={field.value ?? ""} onChange={field.onChange} />
                          </div>

                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )
                    }}
                  />

                  <FieldError errors={[errors.root]} />
                </FieldGroup>
              </div>

              <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t bg-background px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto sm:min-w-24"
                  disabled={isSubmitting || !usernameOk}
                >
                  {isSubmitting && <Loader2 />}
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        file={avatar.source}
        aspect={AVATAR_ASPECT}
        circular
        maxBytes={IMAGE_MAX_BYTES}
        maxOutputSize={AVATAR_MAX_OUTPUT}
        onCancel={avatar.cancelCrop}
        onCrop={avatar.confirmCrop}
      />
      <ImageCropDialog
        file={background.source}
        aspect={BACKGROUND_ASPECT}
        maxBytes={IMAGE_MAX_BYTES}
        maxOutputSize={BACKGROUND_MAX_OUTPUT}
        onCancel={background.cancelCrop}
        onCrop={background.confirmCrop}
      />
    </>
  )
}