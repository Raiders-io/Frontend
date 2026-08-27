import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { changePageLogin, changePageSignup } from "@/utils/router/changePage"
import { useTranslation } from 'react-i18next'

export function LogOutDropDown() {
  const { t } = useTranslation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded"
          aria-label={t('openUnauthenticatedUserMenu', 'Open unauthenticated user menu')}
        >
          <Avatar>
            <AvatarImage
              src="default-avatar.jpg"
              alt={t('defaultAvatarImage', 'Default Avatar Image')}
            />
            <AvatarFallback>{t('defaultAvatarImage', 'Default Avatar Image')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={changePageLogin} aria-label={t('login', 'Login')}>
            {t('login', 'Login')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={changePageSignup} aria-label={t('signUp', 'Sign Up')}>
            {t('signUp', 'Sign Up')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
