import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera, Pencil } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Me, UpdateMePayload } from "@/utils/types/user"
import { userService } from "@/services/user_service"
import { UserAvatar } from "@/components/user/UserAvatar"
import { getErrorMessage } from "./utils"

// Règles alignées sur le backend (USER_CONSTRAINTS / AVATAR_CONSTRAINTS)
const AVATAR_MAX_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Requis")
    .max(20, "20 caractères maximum")
    .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),
  firstname: z.string().trim().max(30, "30 caractères maximum"),
  lastname: z.string().trim().max(30, "30 caractères maximum"),
  bio: z.string().trim().max(500, "500 caractères maximum"),
})

type FormValues = z.infer<typeof schema>

interface Props {
  me: Me
  onSaved: (me: Me) => void
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-destructive text-xs">{message}</p> : null
}

export function EditProfileDialog({ me, onSaved }: Props) {
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

  function toDefaults(user: Me): FormValues {
    return {
      username: user.username,
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      bio: user.bio ?? "",
    }
  }

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
      setAvatarError("Formats acceptés : JPG, PNG, WebP")
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError("2 Mo maximum")
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setAvatarError(null)
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: FormValues) => {
    // On n'envoie que les champs modifiés (et non vides) :
    // le validateur d'unicité du username rejetterait le pseudo actuel.
    const payload: UpdateMePayload = {}
    ;(Object.keys(dirtyFields) as (keyof FormValues)[]).forEach((key) => {
      if (values[key]) payload[key] = values[key]
    })
    if (avatar) payload.avatar = avatar

    if (Object.keys(payload).length === 0) {
      handleOpenChange(false)
      return
    }

    try {
      const updated = await userService.updateMe(payload)
      onSaved(updated)
      handleOpenChange(false)
    } catch (e) {
      setError("root", { message: getErrorMessage(e, "Mise à jour impossible") })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5" />
          Modifier
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>Ces informations sont visibles par les autres utilisateurs.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={me}/>
            <div className="space-y-1">
              <Button type="button" variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Camera className="size-3.5" />
                  Changer la photo
                  <input
                    type="file"
                    accept={AVATAR_TYPES.join(",")}
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
              </Button>
              <p className="text-muted-foreground text-xs">JPG, PNG ou WebP · 2 Mo · min. 200×200</p>
              <FieldError message={avatarError ?? undefined} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input id="username" autoComplete="off" {...register("username")} />
            <FieldError message={errors.username?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstname">Prénom</Label>
              <Input id="firstname" {...register("firstname")} />
              <FieldError message={errors.firstname?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastname">Nom</Label>
              <Input id="lastname" {...register("lastname")} />
              <FieldError message={errors.lastname?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <span className="text-muted-foreground text-xs tabular-nums">{bioLength}/500</span>
            </div>
            <Textarea id="bio" rows={4} className="resize-none" {...register("bio")} />
            <FieldError message={errors.bio?.message} />
          </div>

          <FieldError message={errors.root?.message} />

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
