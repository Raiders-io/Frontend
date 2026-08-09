import FileListWidget from '@/components/FileListWidget'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState } from 'react'

export default function IndexPage() {
    const [zoneOneVisible, setZoneOneVisible] = useState(true)
    const [zoneTwoVisible, setZoneTwoVisible] = useState(true)

    return (
<>
    <div>
      <Button onClick={() => setZoneOneVisible(!zoneOneVisible)}>{zoneOneVisible ? 'Hide One' : 'Show One'}</Button>
      <Button onClick={() => setZoneTwoVisible(!zoneTwoVisible)}>{zoneTwoVisible ? 'Hide Two' : 'Show Two'}</Button>
    </div>
    <ResizablePanelGroup orientation="horizontal">
    {zoneOneVisible && (
      <ResizablePanel>
        Zone One
        <FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={10} />
      </ResizablePanel>
    )}
    <ResizableHandle />
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
