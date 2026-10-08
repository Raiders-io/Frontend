import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { AvatarDropdown } from "./AvatarDropDown"
import { LogOutDropDown } from "./LogOutDropDown"
import { useAuthStore } from "@/utils/stores/auth_store"
import { changePageHome } from "@/utils/router/changePage"
import CustomSearchBar from "./search/CustomSearchBar"
import type {
  SearchResourceOption,
  SearchSortValue,
} from "@/utils/types/component"

const resources: SearchResourceOption[] = [
  { label: "All", value: "all" },
  { label: "Lessons", value: "lesson" },
  { label: "Users", value: "user" },
  { label: "Exam", value: "exam" },
]

const sortOptions: { label: string; value: SearchSortValue }[] = [
  {label: "Title", value: "title"},
  {label: "Creation Date", value: "created_at"},
  {label: "Updated Date", value: "updated_at"},
  // {label: "Relevance", value: "relevance"},
]

const TopNavBar = () => {

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
      <CustomSearchBar resources={resources} sortOptions={sortOptions} className="max-w-2/3"/>


      <div className="flex items-center">
        {useAuthStore().user ? <AvatarDropdown /> : <LogOutDropDown />}
      </div>
    </nav>
  )
}

export default TopNavBar
