"use client"

import type { Tag, file as FileItem } from "@/utils/types/lesson"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field"
import {
  Lock,
  Globe,
  FileText,
  Download,
  Edit,
  MoreHorizontal,
  Share2,
  Trash2,
  Calendar,
  User,
} from "lucide-react"

// --- Types ---
export interface Lesson {
  id?: string | number
  title: string
  isPrivate?: boolean
  description?: string
  tags: Tag[]
  files?: FileItem[]
  createdAt?: string
  author?: string
}

interface LessonDisplayProps {
  lesson: Lesson
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onFileDownload?: (file: FileItem) => void
}

export default function LessonDisplay({
  lesson,
  onEdit,
  onDelete,
  onShare,
  onFileDownload,
}: LessonDisplayProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              ← Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <FieldGroup>
          {/* Title & Privacy Section */}
          <Field>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={lesson.isPrivate ? "secondary" : "default"}
                    className="gap-1.5"
                  >
                    {lesson.isPrivate ? (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3" />
                        Public
                      </>
                    )}
                  </Badge>
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                  {lesson.tags.length > 3 && (
                    <Badge variant="outline">+{lesson.tags.length - 3}</Badge>
                  )}
                </div>
                <FieldTitle className="text-4xl font-bold tracking-tight">
                  {lesson.title}
                </FieldTitle>
                {(lesson.author || lesson.createdAt) && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {lesson.author && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{lesson.author}</span>
                      </div>
                    )}
                    {lesson.createdAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{lesson.createdAt}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Field>

          <FieldSeparator />

          {/* Description Section */}
          <Field>
            <FieldLabel className="text-lg font-semibold">Description</FieldLabel>
            <FieldContent>
              {lesson.description ? (
                <ScrollArea className="max-h-[400px] rounded-md border p-4">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                    {lesson.description}
                  </p>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </FieldContent>
          </Field>

          <FieldSeparator />

          {/* Tags Section */}
          <Field>
            <div className="flex items-baseline justify-between">
              <FieldLabel className="text-lg font-semibold">Tags</FieldLabel>
              <FieldDescription>
                {lesson.tags.length} {lesson.tags.length === 1 ? "tag" : "tags"}
              </FieldDescription>
            </div>
            <FieldContent>
              {lesson.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer transition-colors hover:bg-secondary/80"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No tags assigned to this lesson.
                </p>
              )}
            </FieldContent>
          </Field>

          <FieldSeparator />

          {/* Files Section */}
          <Field>
            <div className="flex items-baseline justify-between">
              <FieldLabel className="text-lg font-semibold">Attachments</FieldLabel>
              <FieldDescription>
                {lesson.files?.length ?? 0}{" "}
                {lesson.files?.length === 1 ? "file" : "files"}
              </FieldDescription>
            </div>
            <FieldContent>
              {lesson.files && lesson.files.length > 0 ? (
                <div className="space-y-2">
                  {lesson.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{file.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            Click to download
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileDownload?.(file)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No files attached to this lesson.
                </p>
              )}
            </FieldContent>
          </Field>

          {/* Danger Zone */}
          {onDelete && (
            <>
              <FieldSeparator />
              <Field>
                <FieldLabel className="text-lg font-semibold text-destructive">
                  Danger Zone
                </FieldLabel>
                <FieldDescription>
                  Permanently delete this lesson. This action cannot be undone.
                </FieldDescription>
                <FieldContent>
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    className="w-fit"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Lesson
                  </Button>
                </FieldContent>
              </Field>
            </>
          )}
        </FieldGroup>
      </div>
    </div>
  )
}