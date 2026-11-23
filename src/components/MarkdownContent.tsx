import ReactMarkdown from "react-markdown"
import { ReactMarkdownStyle } from "@/utils/style/ReactMarkdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { cn } from "@/utils/lib/shadcn"

const schema = {
  ...defaultSchema,
  tagNames: [
    "p",
    "img",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "h3",
    "h4",
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

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content) return null

  return (
    <div className={cn("text-sm leading-relaxed text-foreground/80 wrap-break-word", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={ReactMarkdownStyle}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}