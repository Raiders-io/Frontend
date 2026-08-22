import { isThemeDark } from '@/components/theme-provider'

export const GithubLogoComponent = () => {
	return (
		isThemeDark() ? (
			<img height="32" width="32" src="https://cdn.simpleicons.org/github/black" />
		) : (
			<img height="32" width="32" src="https://cdn.simpleicons.org/github/white" />
		)
	)
}