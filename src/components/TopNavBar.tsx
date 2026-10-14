import { Button } from "@/components/ui/button"
import { changePageHome } from "@/utils/router/changePage"
import CustomSearchBar from "./search/CustomSearchBar"
import type {
  SearchResourceOption,
  SearchSortValue,
} from "@/utils/types/component"
import { UserMenu } from "./user/UserMenu"
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from "react"

const resources: SearchResourceOption[] = [
  { label: "All", value: "all" },
  { label: "Lessons", value: "lesson" },
  { label: "Users", value: "user" },
  { label: "Exam", value: "exam" },
]

const sortOptions: { label: string; value: SearchSortValue }[] = [
  { label: "Title", value: "title" },
  { label: "Creation Date", value: "created_at" },
  { label: "Updated Date", value: "updated_at" },
  // { label: "Relevance", value: "relevance" },
]

const TopNavBar = () => {
	const { t } = useTranslation()
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

  return (
    <nav className="flex items-center justify-between gap-6 border-b p-4">
      <Button
        variant="ghost"
        className="h-10 shrink-0 cursor-pointer gap-2.5 rounded-full py-0 pr-4 pl-1.5 transition-colors"
        onClick={changePageHome}
        aria-label={i18next.t('goToHomePage', 'Go to Home Page')}
      >
        <img
          src="/favicon.png"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden text-lg font-semibold tracking-tight sm:inline">
          Raiders.io
        </span>
      </Button>

      <CustomSearchBar
        resources={resources}
        sortOptions={sortOptions}
        className="max-w-2/3"
      />

      <div className="flex shrink-0 items-center">
        <UserMenu />
      </div>
    </nav>
  )
}

export default TopNavBar
