import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils/lib/shadcn"
import type { SearchResourceOption } from "@/utils/types/component"
import { useSearchBar } from "./searchbar_context"

interface SearchBarResourceProps {
  options: SearchResourceOption[]
  className?: string
  placeholder?: string
}

export const SearchBarResource = ({
  options,
  placeholder,
  className,
}: SearchBarResourceProps) => {
  const { resource, setResource } = useSearchBar()

  return (
    <div
      className={cn(
        "flex items-center border-r rounded-l-[inherit] rounded-r-none",
        className,
      )}
    >
      <Select
        value={resource?.value ?? placeholder}
        onValueChange={(val) => {
          const selectedOption = options.find((option) => option.value === val)
          if (selectedOption) {
            setResource?.(selectedOption)
          }
        }}
      >
        <SelectTrigger className={cn("rounded-r-none font-bold")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
