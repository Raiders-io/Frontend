import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera, Loader2, Pencil, X } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/user/UserAvatar"

import type { PrivateProfile, UpdateMePayload } from "@/utils/types/user"
import { useUpdateMe } from "@/services/user/user_queries"
import { getErrorMessage } from "./utils"
import { UserBackground } from "@/components/user/UserBackground"

const IMAGE_MAX_BYTES = 2 * 1024 * 1024
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const BIO_MAX_LENGTH = 5000

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Required")
    .max(20, "Maximum 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscore only"),
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

function useImagePicker() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function clear() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setError(null)
  }

  function pick(next?: File) {
    if (!next) return
    if (!IMAGE_TYPES.includes(next.type)) {
      clear()
      setError("Accepted extensions: JPG, PNG, WebP")
      return
    }
    if (next.size > IMAGE_MAX_BYTES) {
      clear()
      setError("Maximum 2 MB")
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setError(null)
    setFile(next)
    setPreview(URL.createObjectURL(next))
  }

  return { file, preview, error, pick, clear }
}

interface Props {
  me: PrivateProfile
}

export function EditProfileDialog({ me }: Props) {
  const updateMe = useUpdateMe()
  const [open, setOpen] = useState(false)
  const avatar = useImagePicker()
  const background = useImagePicker()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(me),
  })

  const bioLength = watch("bio")?.length ?? 0

  function handleOpenChange(next: boolean) {
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

    if (dirtyFields.username) {
      payload.username = values.username
    }

    if (avatar.file) {
      payload.avatar = avatar.file
    }

    if (background.file) {
      payload.background = background.file
    }

    if (Object.keys(payload).length === 0) {
      handleOpenChange(false)
      return
    }

    try {
      await updateMe.mutateAsync(payload)
      handleOpenChange(false)
    } catch (e) {
      setError("root", {
        message: getErrorMessage(e, "Failed to update profile"),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 p-0 sm:max-h-none sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>This information is visible to other users.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          {/* Scroll uniquement sur mobile (< sm) */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:overflow-visible">
            <FieldGroup className="gap-5">
              {/* Banner + avatar */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="aspect-3/1 w-full overflow-hidden rounded-lg bg-muted">
                    {background.preview ? (
                      <img
                        src={background.preview}
                        alt="Background preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserBackground userId={me.id} className="h-full w-full" />
                    )}
                  </div>

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
                    <Button type="button" variant="secondary" size="sm" asChild>
                      <label className="cursor-pointer">
                        <Camera />
                        <span className="max-sm:sr-only">Change background</span>
                        <input
                          type="file"
                          accept={IMAGE_TYPES.join(",")}
                          className="sr-only"
                          onChange={(e) => {
                            background.pick(e.target.files?.[0])
                            e.target.value = ""
                          }}
                        />
                      </label>
                    </Button>
                  </div>

                  {/* Avatar qui chevauche la bannière */}
                  <label className="group absolute -bottom-9 left-4 cursor-pointer rounded-full ring-4 ring-background">
                    {avatar.preview ? (
                      <Avatar className="size-18">
                        <AvatarImage
                          src={avatar.preview}
                          alt="Profile picture preview"
                          className="object-cover"
                        />
                      </Avatar>
                    ) : (
                      <UserAvatar user={me} className="size-18" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <Camera className="size-5" />
                    </span>
                    <input
                      type="file"
                      accept={IMAGE_TYPES.join(",")}
                      className="sr-only"
                      aria-label="Change photo"
                      onChange={(e) => {
                        avatar.pick(e.target.files?.[0])
                        e.target.value = ""
                      }}
                    />
                  </label>
                </div>

                {/* espace pour l'avatar qui déborde */}
                <div className="space-y-1 pt-10">
                  <div className="flex items-center justify-between gap-2">
                    <FieldDescription>Photo · JPG, PNG, WebP · Max 2 MB · Min. 200×200</FieldDescription>
                    {avatar.file && (
                      <Button type="button" variant="ghost" size="xs" onClick={avatar.clear}>
                        <X />
                        Cancel
                      </Button>
                    )}
                  </div>
                  <FieldDescription>Background · Max 2 MB · Min. 600×200 · Ratio 3:1</FieldDescription>
                  {avatar.error && <FieldError>{avatar.error}</FieldError>}
                  {background.error && <FieldError>{background.error}</FieldError>}
                </div>
              </div>

              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  autoComplete="off"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
                <FieldError errors={[errors.username]} />
              </Field>

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

              <Field data-invalid={!!errors.bio}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <span
                    className={`text-xs tabular-nums ${
                      bioLength > BIO_MAX_LENGTH ? "font-medium text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {bioLength}/{BIO_MAX_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="bio"
                  rows={4}
                  aria-invalid={!!errors.bio}
                  className="max-h-32 resize-none overflow-y-auto"
                  {...register("bio")}
                />
                <FieldError errors={[errors.bio]} />
              </Field>

              <FieldError errors={[errors.root]} />
            </FieldGroup>
          </div>

          {/* Footer : fixe en bas, boutons empilés sur mobile, alignés à droite sur desktop */}
          <DialogFooter className="shrink-0 flex-col-reverse gap-2 border-t bg-background px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto sm:min-w-24" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
