import { cn } from "@/utils/lib/shadcn"

type MessageTone = "error" | "muted" | "success"

/** One-line message under a field. Keeps its height to avoid layout shifts. */
export function FormMessage({
  id,
  tone,
  children,
}: {
  id: string
  tone: MessageTone
  children?: React.ReactNode
}) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex min-h-4 items-center gap-1.5 text-xs leading-4",
        tone === "error" && "text-destructive",
        tone === "muted" && "text-muted-foreground",
        tone === "success" && "text-emerald-600 dark:text-emerald-500",
      )}
    >
      {children}
    </p>
  )
}
