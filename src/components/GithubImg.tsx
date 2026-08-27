import { isThemeDark } from "@/components/theme-provider"
import i18next from 'i18next'

export const GithubLogoComponent = () => {
  return isThemeDark() ? (
    <img
      height="32"
      width="32"
      src="https://cdn.simpleicons.org/github/black"
      alt={i18next.t('githubLogo', 'GitHub Logo')}
    />
  ) : (
    <img
      height="32"
      width="32"
      src="https://cdn.simpleicons.org/github/white"
      alt={i18next.t('githubLogo', 'GitHub Logo')}
    />
  )
}
