import { Eye, EyeOff } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  visible: boolean
  onToggle: () => void
  invalid: boolean
}

export function PasswordInput({
  visible,
  onToggle,
  invalid,
  ...props
}: PasswordInputProps) {
  // overflow-hidden: the browser's autofill tint is painted as a square inside
  // the input; clipping the group keeps it flush with the rounded border.
  return (
    <InputGroup className="h-11 overflow-hidden bg-background">
      <InputGroupInput
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={invalid}
        className="h-full"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={onToggle}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
