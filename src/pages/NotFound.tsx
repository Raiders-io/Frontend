import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export function NotFound({
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
}: {
  title?: string
  description?: string
}) {
  return (
    <main className="flex flex-1 w-full items-center justify-center px-4 py-16">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="sm">
            <Link to="/">Back to home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}

export default NotFound