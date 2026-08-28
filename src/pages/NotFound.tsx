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
  const location = useLocation() // Récupère l'URL actuelle

  return (
    <div className="mx-auto w-full max-w-6xl p-6 text-center justify-center items-center flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>404 - Page non trouvée</CardTitle>
        </CardHeader>
        <CardContent>
          <p>La page que vous cherchez n'existe pas.</p>
          <p>
            Vous avez tenté d'accéder à la page :
            <Card>
              <CardContent>{location.pathname}</CardContent>
            </Card>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={changePageHome} aria-label="Retour à l'accueil">Retour à l'accueil</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFound
