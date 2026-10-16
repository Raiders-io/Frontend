import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { IconAction } from "@/components/homemade/IconAction"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownStyle } from "@/utils/style/ReactMarkdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { cn } from "@/utils/lib/shadcn"

const schema = {
  ...defaultSchema,
  tagNames: [
    "p", "img", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
    "blockquote", "code", "pre", "h3", "h4",
  ],
  attributes: {

    p: ["align"],

    img: ["src", "style", "alt", "title", "width", "height"],
    a: ["href", "title"],
  },

  style: {
    properties: ["width", "height"],
  },
  strip: ["style"],
  protocols: {
    href: ["http", "https", "mailto"],
    src: ["http", "https"],
  },
}

interface BiographyProps {
  bio: string
}

export function Biography({ bio }: BiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const check = () => {
      if (isExpanded) return
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1)
    }

    check()

    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [bio, isExpanded])

  if (!bio) return null

  const label = isExpanded ? "Afficher moins" : "Afficher plus"
  const isCollapsed = isOverflowing && !isExpanded

  return (
    <SectionCard title="Bio">
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          <div
            ref={contentRef}
            className={cn(
              "px-4 py-3 text-sm leading-relaxed text-foreground/80 wrap-break-word",
              !isExpanded && "max-h-28 overflow-hidden sm:max-h-32"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
              components={ReactMarkdownStyle}
            >
              {bio}
            </ReactMarkdown>
          </div>

          {isCollapsed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card via-card/70 to-transparent"
            />
          )}
        </div>

        {isOverflowing && (
          <div className="flex justify-center">
            <IconAction
              icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
              label={label}
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
        )}
      </div>
    </SectionCard>
  )
}