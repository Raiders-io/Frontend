import {
  AudioLines,
  FileArchiveIcon,
  FileImageIcon,
  FileJsonIcon,
  FileText,
  MonitorPlay,
  ScrollText,
  Type,
} from "lucide-react"

export const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const size = bytes / 1024 ** index

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

export const formatDate = (dateString?: string) => {
  if (!dateString) {
    return "-"
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export const getFileIcon = (mimeType?: string, fileName?: string) => {
  const label = `${mimeType ?? ""} ${fileName?.match(/\.[^.]+$/)?.[0] ?? ""}`.toLowerCase() ?? ""

  if (label.includes("image")) 
    return <FileImageIcon className="h-4 w-4" />
  if (label.includes("video")) 
    return <MonitorPlay className="h-4 w-4" />
  if (label.includes("audio")) 
    return <AudioLines className="h-4 w-4" />
  if (label.includes("pdf")) 
    return <ScrollText className="h-4 w-4" />
  if (label.includes("zip") || label.includes("rar") || label.includes("tar"))
    return <FileArchiveIcon className="h-4 w-4" />
  if (label.includes("json")) 
    return <FileJsonIcon className="h-4 w-4" />
  if (label.includes("text") || label.includes("plain") || label.includes("markdown")) 
    return <FileText className="h-4 w-4" />
  return <Type className="h-4 w-4" />
}
