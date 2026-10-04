import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { AvatarDropdown } from "./AvatarDropDown"
import { useEffect, useRef } from "react"
import { LogOutDropDown } from "./LogOutDropDown"
import { useAuthStore } from "@/utils/stores/auth_store"
import { changePageHome } from "@/utils/router/changePage"

const TopNavBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <ButtonGroup>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={changePageHome}
            aria-label="Go to Home Page"
          >
            <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            className="text-lg font-semibold"
            onClick={changePageHome}
            aria-label="Go to Home Page"
          >
            Raiders.io
          </Button>
        </ButtonGroup>
      </div>
      {/* <CustomSearchBar className="flex-1 mx-8 max-w-3/4"/> */}


      <div className="flex items-center">
        {useAuthStore().user ? <AvatarDropdown /> : <LogOutDropDown />}
      </div>
    </nav>
  )
}

export default TopNavBar
