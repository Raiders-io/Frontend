import type { ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, ChevronDown } from "lucide-react"

import { cn } from "@/utils/lib/shadcn"
import type { Lesson } from "@/utils/types/lesson"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cva } from "class-variance-authority"

interface LessonCardProps {
  lesson: Lesson
  variant?: "preview" | "default" | "small"
  expandThreshold?: number
  scrollThreshold?: number
  actions?: ReactNode
  className?: string
}

const lessonStyle = {
  base: {
    default: "w-80 h-80",
    preview: "w-156 max-w h-20",
    small: "w-64 h-64",
  },

  Header: {
    default: "",
    preview: "",
    small: "",
  },

  Title: {
    default: "p-2 flex font-bold text-2xl justify-center border-dashed border rounded-xl hover:shadow-md hover:bg-400",
    preview: "font-bold text-lg",
    small: "p-1 flex font-bold text-xl justify-center border-dashed border rounded-xl",
  },

  Description: {
    default: "text-lg font-semibold text-pretty line-clamp-4 w-full p-2",
    preview: "text-pretty line-clamp-1 max-w-64",
    small: "text-pretty line-clamp-2 text-lg",
  },

  Content: {
    default: "",
    preview: "",
    small: "",
  }
}

const PREVIEW_TAG_LIMIT = 3

export default function LessonCard({
  lesson,
  variant = "default",
  scrollThreshold,
  actions,
  className, }: LessonCardProps) {
  const [scroll, setScroll] = useState(false)
  const { title, tags, description, author } = lesson

  const headerVariant = () => {
    return (
      <CardHeader>
        {variant === 'preview'
          ?
          <div className="flex flex-row gap-4">
            <BookOpen className="h-full w-12 justify-center" />
            <div className="flex flex-col">
              <CardTitle className={`${lessonStyle.Title.preview}`}>{title}</CardTitle>
              <CardDescription className={`${lessonStyle.Description[variant]}`}>{description}</CardDescription>
            </div>
          </div>
          : <><CardTitle className={`${lessonStyle.Title[variant]}`}>{title}</CardTitle>
            <CardDescription className={`${lessonStyle.Description[variant]}`}>{description}</CardDescription>
          </>
        }
      </CardHeader>
    )
  }

  const contentVariant = () => {
    return (
      <></>
    )
  }

  return (
    <Card className={`${lessonStyle.base[variant]}`}>
      {headerVariant()}
    </Card>
  )
}

// export default function LessonCard({
//   lesson,
//   variant = "full",
//   expandThreshold = 120,
//   actions,
//   className,
// }: LessonCardProps) {
//   const [open, setOpen] = useState(false)
//
//   const { author, title, slug, tags } = lesson
//   const description = lesson.description?.trim()
//   const isPreview = variant === "preview"
//   const canExpand = !isPreview && !!description && description.length > expandThreshold
//
//   const visibleTags = isPreview ? tags.slice(0, PREVIEW_TAG_LIMIT) : tags
//   const hiddenTagCount = tags.length - visibleTags.length
//
//   return (
//     <Card
//       className={cn(
//         "h-full gap-4 transition-shadow hover:shadow-md",
//         className
//       )}
//     >
//       <CardHeader>
//         <CardTitle className={isPreview ? "text-base" : "text-xl"}>
//           <Link
//             to={`/lesson/${author.username}/${slug}/`}
//             className="underline-offset-4 hover:underline"
//           >
//             {title}
//           </Link>
//         </CardTitle>
//
//         <Collapsible open={open} onOpenChange={setOpen} asChild>
//           <CardDescription className="space-y-1">
//             {description ? (
//               <p
//                 className={cn(
//                   "text-pretty",
//                   isPreview && "line-clamp-2",
//                   !isPreview && !open && "line-clamp-3"
//                 )}
//               >
//                 {description}
//               </p>
//             ) : (
//               <p className="italic">No description</p>
//             )}
//
//             {canExpand && (
//               <CollapsibleTrigger asChild>
//                 <Button
//                   variant="link"
//                   size="sm"
//                   className="h-auto gap-1 p-0 text-xs"
//                 >
//                   {open ? "Show less" : "Show more"}
//                   <ChevronDown
//                     className={cn(
//                       "size-3 transition-transform",
//                       open && "rotate-180"
//                     )}
//                   />
//                 </Button>
//               </CollapsibleTrigger>
//             )}
//           </CardDescription>
//         </Collapsible>
//       </CardHeader>
//
//       {tags.length > 0 && (
//         <CardContent className="flex flex-wrap gap-1.5">
//           {visibleTags.map((tag) => (
//             <Badge key={tag.id} variant="secondary">
//               {tag.name}
//             </Badge>
//           ))}
//           {hiddenTagCount > 0 && (
//             <Badge variant="outline">+{hiddenTagCount}</Badge>
//           )}
//         </CardContent>
//       )}
//
//       <CardFooter className="mt-auto flex-col items-stretch gap-3">
//         <Separator />
//         <div className="flex flex-wrap items-center justify-between gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="-ml-2 gap-2 px-2"
//             asChild
//           >
//             <Link to={`/users/${author.username}/`}>
//               <Avatar className="size-6">
//                 <AvatarFallback className="text-xs uppercase">
//                   {author.username.slice(0, 2)}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="text-muted-foreground">{author.username}</span>
//             </Link>
//           </Button>
//
//           {actions && <div className="flex items-center gap-2">{actions}</div>}
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
