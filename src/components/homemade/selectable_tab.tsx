import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import CheckBoxTab from "./checkbox_tab"

type Key = string | number

//TODO className is not working for the table, need to fix it

interface SelectableTabProps<T, K extends Key> {
  data: T[]
  getKey: (item: T) => K
  getLabel: (item: T) => React.ReactNode
  selected: Set<K>
  onSelectionChanged: (selection: Set<K>) => void
  className?: string
  children?: React.ReactNode
}

export default function SelectableTab<T, K extends Key>({
  data,
  getKey,
  getLabel,
  selected,
  onSelectionChanged,
  className,
  children,
}: SelectableTabProps<T, K>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{children}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle></PopoverTitle>
          <PopoverDescription></PopoverDescription>
        </PopoverHeader>
        <CheckBoxTab
          data={data}
          getKey={getKey}
          getLabel={getLabel}
          selected={selected}
          onSelectionChanged={onSelectionChanged}
          className={className}
        />
      </PopoverContent>
    </Popover>
  )
}
