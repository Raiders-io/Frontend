import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Controlled visibility. Omit it and the component manages it itself. */
  visible?: boolean
  onToggle?: () => void
  /** Defaults to the `aria-invalid` prop. */
  invalid?: boolean
}

export function PasswordInput({
  visible,
  onToggle,
  invalid,
  ...props
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = useState(false)

  const isVisible = visible ?? internalVisible
  const toggle = onToggle ?? (() => setInternalVisible((v) => !v))
  const isInvalid =
    invalid ??
    (props["aria-invalid"] === true || props["aria-invalid"] === "true")

  // overflow-hidden: the browser's autofill tint is painted as a square inside
  // the input; clipping the group keeps it flush with the rounded border.
  return (
    <InputGroup className="h-11 overflow-hidden bg-background">
      <InputGroupInput
        {...props}
        type={isVisible ? "text" : "password"}
        aria-invalid={isInvalid}
        className="h-full"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          onClick={toggle}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
