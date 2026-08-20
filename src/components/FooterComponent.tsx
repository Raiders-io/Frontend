import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  changePageHome,
  changePageChat,
  changePageFileList,
  changePageLessons,
  changePageFriends,
  changePageProfile,
  changePageEditProfile,
  changePageAbout,
  changePageContact,
} from "@/utils/router/changePage"
import { Separator } from "@/components/ui/separator"

const NavButton = ({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) => {
  return (
    <Button
      variant="ghost"
      className="items-center justify-center w-20 h-[30%]"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export const FooterComponent = () => {
  return (
    <footer>
      <Card className="flex h-64 w-full flex-row gap-4 p-4">
        <Accordion type="single" collapsible className="w-100 p-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Quick info 1</AccordionTrigger>
            <AccordionContent>Content of the first ite²m.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Quick info 2</AccordionTrigger>
            <AccordionContent>Content of the second item.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Quick info 3</AccordionTrigger>
            <AccordionContent>Content of the third item.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Quick info 4</AccordionTrigger>
            <AccordionContent>Content of the fourth item.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex h-full w-[80%] flex-col flex-wrap items-center justify-center gap-2">
          <NavButton label="Home" onClick={changePageHome} />
          <NavButton label="Files" onClick={changePageFileList} />
          <NavButton label="Lessons" onClick={changePageLessons} />
          <Separator orientation="vertical" className="h-[80%] border-1" />
          <NavButton label="Profile" onClick={changePageProfile} />
          <NavButton label="Friends" onClick={changePageFriends} />
          <NavButton label="Messages" onClick={changePageChat} />
          <Separator orientation="vertical" className="h-[80%] border-1" />
          <NavButton label="Settings" onClick={changePageEditProfile} />
          <NavButton label="About" onClick={changePageAbout} />
          <NavButton label="Contact" onClick={changePageContact} />
        </div>
        <div className="flex h-full w-50 shrink-0 flex-col items-center justify-between">
          <Button
            variant="ghost"
            className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4 text-lg font-semibold"
            onClick={changePageHome}
          >
            <img
              src="/favicon.png"
              alt="Logo"
              className="h-[50%] w-full rounded-full p-0 object-contain rounded-lg"
            />
            <span className="h-[20%] w-full px-4 text-lg font-semibold">
              Raiders.io
            </span>
          </Button>
        </div>
      </Card>
    </footer>
  )
}
