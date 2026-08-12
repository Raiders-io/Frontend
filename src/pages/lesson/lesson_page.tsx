import FileListWidget from '@/components/FileListWidget'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useState } from 'react'

export default function IndexPage() {
    const [zoneOneVisible, setZoneOneVisible] = useState(true)
    const [zoneTwoVisible, setZoneTwoVisible] = useState(true)

    return (
<>
     
    <ResizablePanelGroup orientation="horizontal">
    {!zoneTwoVisible ? "" :(
      <Button onClick={() => setZoneOneVisible(!zoneOneVisible)}>
        {zoneOneVisible ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>
    )}
    {zoneOneVisible && (
      <ResizablePanel>
        Zone One
        <FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
      </ResizablePanel>
    )}
    {!zoneOneVisible || !zoneTwoVisible ? null : <ResizableHandle />}
    {!zoneOneVisible ? "" :(
      <Button onClick={() => setZoneTwoVisible(!zoneTwoVisible)}>
        {zoneTwoVisible ? <PanelRightClose /> : <PanelRightOpen />}
      </Button>
    )}
    {zoneTwoVisible && (
      <ResizablePanel>
        Zone Two
        <FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
      </ResizablePanel>
    )}
  </ResizablePanelGroup>
</>
    )
}
