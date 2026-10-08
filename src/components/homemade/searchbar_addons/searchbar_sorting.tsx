import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SearchSort, SearchSortValue } from "@/utils/types/component"
import { useState } from "react"

interface SearchBarSortingProps {
  placeholder?: string
  className?: string
  value?: SearchSort
  options: { label: string; value: SearchSortValue }[]
  onSortChange: (sort: SearchSort) => void
}

export const SearchBarSorting = ({
  placeholder,
  value,
  className,
  options,
  onSortChange,
}: SearchBarSortingProps) => {
  const [sorting, setSorting] = useState<SearchSortValue>(options[0].value)
  const [isAscending, setIsAscending] = useState<boolean>(true)

  const handleSortChange = (value: SearchSortValue) => {
    setSorting(value)
    onSortChange({value, isAscending})
  }

  const handleOrderChange = () => {
    setIsAscending(!isAscending)
    onSortChange({value: sorting, isAscending: !isAscending})
  }

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild className="p-1">
          <Button variant="ghost">
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader className="font-bold">Sorting by</PopoverHeader>
          <div className="flex inline-flex items-center justify-between">
            <Select value={sorting} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="p-3.5" onClick={handleOrderChange}>
              {isAscending ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
