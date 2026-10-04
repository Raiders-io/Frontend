import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils/lib/shadcn"
import { useSearchBar } from "./searchbar_context"

export interface ResourceOption {
  label: string
  value: string
}

interface SearchBarResourceProps {
  options: ResourceOption[]
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
        value={resource.value}
        onValueChange={(val) =>
          setResource(options.find((o) => o.value === val))
        }
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
