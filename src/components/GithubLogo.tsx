import { isThemeDark } from "@/components/theme-provider"

export const GithubLogo = () => {
  return isThemeDark() ? (
    <img
      height="32"
      width="32"
      src="/github_white.svg"
      alt="GitHub Logo"
    />
  ) : (
    <img
      height="32"
      width="32"
      src="/github_black.svg"
      alt="GitHub Logo"
    />
  )
}
