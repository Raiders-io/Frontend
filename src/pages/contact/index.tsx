import { ArrowUpRight } from "lucide-react"
import { GithubLogoComponent } from "@/components/GithubImg"
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
	const { t } = useTranslation()
	return (
		<div className="mx-auto max-w-2xl px-6 py-16">
			<h1 className="text-3xl font-semibold tracking-tight text-foreground">
				{t('contact-msg')}
			</h1>
			<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
				{t('raiders-issues')}
			</p>

			<div className="mt-10 space-y-3">
				<a href="https://github.com/Raiders-io" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-lg border p-5 transition-colors hover:bg-muted/40">
					<span className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-background">
						<GithubLogoComponent />
					</span>
					<span className="min-w-0 flex-1">
						<span className="block text-sm font-medium text-foreground">{t('raidersioSurGithub', 'Raiders.io sur GitHub')}</span>
						<span className="block truncate font-mono text-xs text-muted-foreground">github.com/Raiders-io</span>
					</span>
					<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
				</a>

				<a href="https://docs.github.com/fr/issues/tracking-your-work-with-issues/using-issues/creating-an-issue" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-lg border p-5 transition-colors hover:bg-muted/40">
					<span className="flex size-11 shrink-0 items-center justify-center rounded-md border bg-background">
						<GithubLogoComponent />
					</span>
					<span className="min-w-0 flex-1">
						<span className="block text-sm font-medium text-foreground">{t('tutoCrationDuneIssue', 'Tuto création d\'une issue')}</span>
						<span className="block truncate font-mono text-xs text-muted-foreground">docs.github.com</span>
					</span>
					<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
				</a>
			</div>
		</div>
	)
}