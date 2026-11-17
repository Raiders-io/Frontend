import { Button } from '@/components/ui/button'

interface SelectPanelProps<T extends string> {
  options: T[]
  viewMode: T,
  setViewMode: (val: T) => void,
  render: (option: T) => React.ReactNode,
}

export default function SelectPanel<T extends string>({ options, viewMode, setViewMode, render }: SelectPanelProps<T>) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
      {options.map((option) => {
        const isSelected = viewMode === option

        return (
          <Button
            key={option}
            variant={isSelected ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode(option)}
            className="gap-1.5"
            aria-pressed={isSelected}
          >
            {render(option)}
          </Button>
        );
      })}
    </div>
  );
}
