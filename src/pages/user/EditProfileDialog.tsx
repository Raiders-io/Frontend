import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera, Pencil } from "lucide-react"
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

const AVATAR_MAX_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]
const BIO_MAX_LENGTH = 5000

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Required")
    .max(20, "Maximum 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and _ only"),
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

interface Props {
  me: PrivateProfile
}

export function EditProfileDialog({ me }: Props) {
  const updateMe = useUpdateMe()
  const [open, setOpen] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

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

  function clearAvatar() {
    if (preview) URL.revokeObjectURL(preview)
    setAvatar(null)
    setPreview(null)
    setAvatarError(null)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) reset(toDefaults(me))
    else clearAvatar()
  }

  function handleFile(file?: File) {
    if (!file) return
    if (!AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Accepted extensions: JPG, PNG, WebP")
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError("Maximum 2 MB")
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setAvatarError(null)
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
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

    if (avatar) {
      payload.avatar = avatar
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>This information is visible to other users.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!avatarError}>
              <div className="flex items-center gap-4">
                {preview ? (
                  <Avatar className="size-18 shrink-0">
                    <AvatarImage src={preview} alt="Profile picture preview" className="object-cover" />
                  </Avatar>
                ) : (
                  <UserAvatar user={me} className="size-18 shrink-0" />
                )}
                <div className="space-y-1">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Camera />
                      Change photo
                      <input
                        type="file"
                        accept={AVATAR_TYPES.join(",")}
                        className="sr-only"
                        onChange={(e) => {
                          handleFile(e.target.files?.[0])
                          e.target.value = ""
                        }}
                      />
                    </label>
                  </Button>
                  <FieldDescription>JPG, PNG, or WebP · Max 2 MB · Min. 200×200</FieldDescription>
                  {avatarError && <FieldError>{avatarError}</FieldError>}
                </div>
              </div>
            </Field>

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

            <div className="grid grid-cols-2 gap-3">
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
                    bioLength > BIO_MAX_LENGTH ? "text-destructive font-medium" : "text-muted-foreground"
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

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
