import { CustomResizablePanelGroup, CustomResizablePanelHandle, CustomResizablePanelLeftZone, CustomResizablePanelRightZone } from "@/components/CustomResizablePanel"
import { CustomResizablePanelLeftZoneToggle, CustomResizablePanelRightZoneToggle } from "@/components/CustomResizablePanel"
import FileListWidget from "@/components/FileListWidget"

export default function IndexPage() {
    return (
<>
  <CustomResizablePanelGroup>
    <CustomResizablePanelLeftZoneToggle />
    <CustomResizablePanelLeftZone>
      <FileListWidget mode="full" showPagination={false} showUpload={true} initialLimit={10} />
    </CustomResizablePanelLeftZone>
    <CustomResizablePanelHandle />
    <CustomResizablePanelRightZoneToggle />
    <CustomResizablePanelRightZone>
      <FileListWidget mode="full" showPagination={true} showUpload={true} initialLimit={5} />
    </CustomResizablePanelRightZone>
  </CustomResizablePanelGroup>
</>
    )
}
