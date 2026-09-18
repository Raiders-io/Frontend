import {
	changePageHome,
	changePageChat,
	changePageFileList,
	changePageLessons,
	changePageFriends,
	changePageProfile,
	changePageEditProfile,
	changePageAbout,
	changePageContact,
} from "@/utils/router/changePage"
import { GithubLogoComponent } from "./GithubImg"
import { useTranslation } from 'react-i18next'

const NAV_COLUMNS = [
	{
		heading: "Plateforme",
		links: [
			{ label: "Home", onClick: changePageHome },
			{ label: "Lessons", onClick: changePageLessons },
			{ label: "Files", onClick: changePageFileList },
		],
	},
	{
		heading: "Compte",
		links: [
			{ label: "Profile", onClick: changePageProfile },
			{ label: "Friends", onClick: changePageFriends },
			{ label: "Messages", onClick: changePageChat },
		],
	},
	{
		heading: "À propos",
		links: [
			{ label: "Settings", onClick: changePageEditProfile },
			{ label: "About", onClick: changePageAbout },
			{ label: "Contact", onClick: changePageContact },
		],
	},
]

export const FooterComponent = () => {
	const { t } = useTranslation()
	return (
		<footer className="w-full border-t bg-background">
			<div className="mx-auto max-w-6xl px-6 py-12">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<div className="col-span-2 sm:col-span-1">
						<button
							onClick={changePageHome}
							className="flex items-center gap-2.5"
							aria-label={t('goToHomePage', 'Go to Home Page')}
						>
							<img
								src="/favicon.png"
								alt="Raiders.io"
								className="size-7 rounded-md object-contain"
							/>
							<span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
								Raiders.io
							</span>
						</button>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('apprends')}
              {t('apprends-part2')}
						</p>
					</div>
					{NAV_COLUMNS.map((column) => (
						<nav key={column.heading} className="flex flex-col gap-3">
							<h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
								{column.heading}
							</h3>
							<ul className="flex flex-col gap-2">
								{column.links.map((link) => (
									<li key={link.label}>
										<button
											onClick={link.onClick}
											aria-label={link.label}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</button>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				<div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} {t('raidersioProjectTranscendence', 'Raiders.io — Project Transcendence')}
					</p>
					<button
						onClick={() => window.open("https://github.com/Raiders-io", "_blank")}
						aria-label={t('viewProjectOnGithub', 'View Project on GitHub')}
						className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<GithubLogoComponent />
						{t('github', 'GitHub')}
					</button>
				</div>
			</div>
		</footer>
	)
}
