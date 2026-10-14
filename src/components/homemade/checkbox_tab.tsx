import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Key = string | number

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={unselectAll}>
          Clear selection
        </Button>
        <span className="text-sm text-muted-foreground">
          {selected.size} selected
        </span>
      </div>
      
      {/* Fixed: className is now applied to the Table, and wrapper ensures proper layout */}
      <div className="rounded-md border">
        <Table className={className}>
          <TableBody>
            {data.map((row) => {
              const key = getKey(row)
              const isSelected = selected.has(key)
              return (
                <TableRow
                  key={key}
                  data-state={isSelected ? "selected" : undefined}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleSelectRow(key, !isSelected)
                  }}
                >
                  <TableCell className="w-12">
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={(checked) => handleSelectRow(key, checked as boolean)}
                      onClick={(e) => e.stopPropagation()} // Prevent double-firing
                    />
                  </TableCell>
                  <TableCell>{getLabel(row)}</TableCell>
                </TableRow>
              )
            })}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}