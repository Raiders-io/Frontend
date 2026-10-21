import LessonCard from "@/components/lesson/LessonCard"
import { Button } from "@/components/ui/button"
import { mockLesson } from "@/utils/mock"
import { ToolboxIcon } from "lucide-react"

export default function TestPage() {
  const lesson = mockLesson

  return (
    <div>
      <h1> This is a test page it should be removed from the final project</h1>
      <div className="flex flex-wrap">
        <LessonCard lesson={lesson[9]} />
        <LessonCard lesson={lesson[9]} variant="small" />
        <LessonCard lesson={lesson[3]} variant="preview" />
        <LessonCard lesson={lesson[9]} actions={<>
          <Button
            variant="outline"
            onClick={() => console.log("prout")}
          >
            <ToolboxIcon />
          </Button>
          
        </>} />
      </div>
    </div>
  )
}
