import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { changePageHome } from "@/utils/router/changePage"
import { useLocation } from "react-router-dom"

const NotFound = () => {
  const location = useLocation()

  return (
    <div className="mx-auto w-full max-w-6xl p-6 text-center justify-center items-center flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>404 - Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The page you are looking for does not exist.</p>
          <p>
            You tried to access the page:
            <Card>
              <CardContent>{location.pathname}</CardContent>
            </Card>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={changePageHome} aria-label="Back to home">Back to home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFound
