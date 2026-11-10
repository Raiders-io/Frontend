import LessonCard from "@/components/lesson/LessonCard"
import { Button } from "@/components/ui/button"
import { mockLesson } from "@/utils/mock"
import { ToolboxIcon } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function TestPage() {
  const { t } = useTranslation()
  const lesson = mockLesson

  return (
    <div>
      <h1> {t('this_test_page_should', 'This is a test page it should be removed from the final project')}</h1>
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
