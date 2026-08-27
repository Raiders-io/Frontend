import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { GithubLogoComponent } from "./GithubImg"
import i18next from 'i18next'

export const FooterComponent = () => {
  const AccordionFooter = () => {
    return (
      <div className="min-w-0 flex-1 overflow-hidden">
        <Accordion type="single" collapsible className="h-full p-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>{i18next.t('quickInfo1', 'Quick info 1')}</AccordionTrigger>
            <AccordionContent>{i18next.t('contentOfTheFirstItem', 'Content of the first item.')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{i18next.t('quickInfo2', 'Quick info 2')}</AccordionTrigger>
            <AccordionContent>{i18next.t('contentOfTheSecondItem', 'Content of the second item.')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{i18next.t('quickInfo3', 'Quick info 3')}</AccordionTrigger>
            <AccordionContent>{i18next.t('contentOfTheThirdItem', 'Content of the third item.')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>{i18next.t('quickInfo4', 'Quick info 4')}</AccordionTrigger>
            <AccordionContent>{i18next.t('contentOfTheFourthItem', 'Content of the fourth item.')}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }

  const NavLinks = () => {
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
          className="h-[30%] w-full"
          onClick={onClick}
          aria-label={label}
        >
          {label}
        </Button>
      )
    }

    const CustomSeparator = () => {
      return (
        <div className="flex items-center justify-center">
          <div className="h-[50%] w-full max-w-[1px] border-1 border-dashed"></div>
        </div>
      )
    }

    return (
      <div className="min-w-0 flex-1 h-full overflow-x-auto">
        <div className="h-full grid sm:grid-cols-5 grid-cols-5 gap-2 min-w-[320px] sm:min-w-0 shrink-0">
          <div className="min-w-0 flex flex-col items-center gap-2 justify-center">
            <NavButton label="Home" onClick={changePageHome} />
            <NavButton label="Files" onClick={changePageFileList} />
            <NavButton label="Lessons" onClick={changePageLessons} />
          </div>
          <CustomSeparator />
          <div className="min-w-0 flex flex-col items-center gap-2 justify-center">
            <NavButton label="Profile" onClick={changePageProfile} />
            <NavButton label="Friends" onClick={changePageFriends} />
            <NavButton label="Messages" onClick={changePageChat} />
          </div>
          <CustomSeparator />
          <div className="min-w-0 flex flex-col items-center gap-2 justify-center">
            <NavButton label="Settings" onClick={changePageEditProfile} />
            <NavButton label={i18next.t('about', 'About')} onClick={changePageAbout} />
            <NavButton label="Contact" onClick={changePageContact} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <footer className="position-sticky bottom-0 z-50 w-full border-t bg-background/80 backdrop-blur">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center m-0 p-0 gap-0">
            {i18next.t('projectTranscendence', 'Project Transcendence')}
          </CardTitle>
          <CardDescription className="text-sm text-center m-0 p-0 gap-0">
            {i18next.t('project-info', 'A project by Raiders.io')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 overflow-hidden p-4 sm:min-h-64 sm:max-h-100 w-full">
          <AccordionFooter />
          <div className="margin-auto min-w-0 flex-1">
            <NavLinks />
          </div>
          <div className="min-w-0 flex-1 flex h-full flex-col items-center justify-center">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border p-2 text-lg font-semibold md:h-[80%] md:w-[80%] sm:h-[400px] sm:w-[400px] h-[400px] w-[400px]"
              onClick={changePageHome}
              aria-label={i18next.t('goToHomePage', 'Go to Home Page')}
            >
              <img
                src="/favicon.png"
                alt={i18next.t('logo', 'Logo')}
                className="h-[50%] w-full rounded-lg object-contain"
              />
              <span className="h-[20%] w-full px-2 text-lg font-semibold truncate">
                Raiders.io
              </span>
            </Button>
          </div>
        </CardContent>
        <Button
          variant="ghost"
          className="h-[30%] w-full"
          onClick={() => window.open("https://github.com/Raiders-io", "_blank")}
          aria-label={i18next.t('viewProjectOnGithub', 'View Project on GitHub')}
        >
          <GithubLogoComponent />
          {i18next.t('see-project-on-github', 'See Project Informations directly on Github through our Organization\n          (external link)')}
        </Button>
      </Card>
    </footer>
  )
}
