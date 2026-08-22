import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react"

interface ResizableZonesContextType {
  LeftZoneVisible: boolean
  setLeftZoneVisible: Dispatch<SetStateAction<boolean>>
  RightZoneVisible: boolean
  setRightZoneVisible: Dispatch<SetStateAction<boolean>>
}

const ResizableZonesContext = createContext<ResizableZonesContextType | null>(
  null,
)

function useResizableZones(): ResizableZonesContextType {
  const ctx = useContext(ResizableZonesContext)
  if (!ctx) {
    throw new Error(
      "CustomResizablePanelLeftZone/B/Handle doit être utilisé à l'intérieur de CustomResizablePanelGroup",
    )
  }
  return ctx
}

export function CustomResizablePanelGroup({
  children,
}: {
  children: ReactNode
}) {
  const [LeftZoneVisible, setLeftZoneVisible] = useState(true)
  const [RightZoneVisible, setRightZoneVisible] = useState(true)

  return (
    <ResizableZonesContext.Provider
      value={{
        LeftZoneVisible,
        setLeftZoneVisible,
        RightZoneVisible,
        setRightZoneVisible,
      }}
    >
      <ResizablePanelGroup orientation="horizontal">
        {children}
      </ResizablePanelGroup>
    </ResizableZonesContext.Provider>
  )
}

export function CustomResizablePanelLeftZone({
  children,
  defaultSize = "50%",
  minSize = "25%",
}: {
  children: ReactNode
  defaultSize?: string | number
  minSize?: string | number
}) {
  const { LeftZoneVisible } = useResizableZones()

  return (
    <>
      {LeftZoneVisible && (
        <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
          {children}
        </ResizablePanel>
      )}
    </>
  )
}

export function CustomResizablePanelRightZone({
  children,
  defaultSize = "50%",
  minSize = "25%",
}: {
  children: ReactNode
  defaultSize?: string | number
  minSize?: string | number
}) {
  const { RightZoneVisible } = useResizableZones()

  return (
    <>
      {RightZoneVisible && (
        <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
          {children}
        </ResizablePanel>
      )}
    </>
  )
}

export function CustomResizablePanelHandle() {
  const { LeftZoneVisible, RightZoneVisible } = useResizableZones()
  return LeftZoneVisible && RightZoneVisible ? <ResizableHandle /> : null
}

export function CustomResizablePanelLeftZoneToggle() {
  const { LeftZoneVisible, setLeftZoneVisible, RightZoneVisible } =
    useResizableZones()

  return (
    <>
      {RightZoneVisible && (
        <Button onClick={() => setLeftZoneVisible(!LeftZoneVisible)}>
          {LeftZoneVisible ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      )}
    </>
  )
}

export function CustomResizablePanelRightZoneToggle() {
  const { LeftZoneVisible, setRightZoneVisible, RightZoneVisible } =
    useResizableZones()

  return (
    <>
      {LeftZoneVisible && (
        <Button onClick={() => setRightZoneVisible(!RightZoneVisible)}>
          {RightZoneVisible ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
      )}
    </>
  )
}
