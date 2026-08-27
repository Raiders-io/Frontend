import { isThemeDark } from "@/components/theme-provider"

export const GithubLogoComponent = () => {
  return isThemeDark() ? (
    <img
      height="32"
      width="32"
      src="https://cdn.simpleicons.org/github/black"
      alt="GitHub Logo"
    />
  ) : (
    <img
      height="32"
      width="32"
      src="https://cdn.simpleicons.org/github/white"
      alt="GitHub Logo"
    />
  )
}
