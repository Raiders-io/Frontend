import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Key = string | number

//TODO className is not working for the table, need to fix it

interface CheckBoxTabProps<T, K extends Key> {
  data: T[]
  getKey: (item: T) => K
  getLabel: (item: T) => React.ReactNode
  selected: Set<K>
  onSelectionChanged: (selection: Set<K>) => void
  className?: string
}

export default function CheckBoxTab<T, K extends Key>({
  data,
  getKey,
  getLabel,
  selected,
  onSelectionChanged,
  className,
}: CheckBoxTabProps<T, K>) {
  const handleSelectRow = (key: K, checked: boolean) => {
    const newSelected = new Set(selected)

    if (checked) {
      newSelected.add(key)
    } else {
      newSelected.delete(key)
    }
    onSelectionChanged(newSelected)
  }

  const unselectAll = () => {
    onSelectionChanged(new Set())
  }

  return (
    <div className={className}>
      <Button variant="outline" onClick={unselectAll}>
        Clear selection
      </Button>
      <Table>
        <TableBody>
          {data.map((row) => {
            const key = getKey(row)
            const isSelected = selected.has(key)
            return (
              <TableRow
                key={key}
                data-state={isSelected ? "selected" : undefined}
                onClick={(event) => {
                  event.stopPropagation()
                  handleSelectRow(key, !isSelected)
                }}
              >
                <TableCell>
                  <Checkbox checked={isSelected} />
                </TableCell>
                <TableCell>{getLabel(row)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
