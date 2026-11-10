import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export function NotFound({
  title = i18next.t('pageNotFound', 'Page not found'),
  description = i18next.t('thePageYouAreLookingForDoesNotExistOrHasBeenMoved', 'The page you are looking for does not exist or has been moved.'),
}: {
  title?: string
  description?: string
}) {
  const { t } = useTranslation()
  return (
    <main className="flex flex-1 w-full items-center justify-center px-4 py-16">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="sm">
            <Link to="/">{t('backToHome', 'Back to home')}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}

export default NotFound