import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AuthLayoutProps {
	title: string
	subtitle: string
	children: ReactNode
	footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
	const { t } = useTranslation()
	return (
		<>
		<div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
			<aside className="relative hidden flex-col justify-between bg-zinc-950 p-12 text-zinc-50 lg:flex">
				<div className="flex items-center gap-2.5">
					<span className="size-2 rounded-full bg-emerald-400" />
					<span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-400">
						Raiders.io
					</span>
				</div>

				<div className="max-w-md">
					<p className="text-3xl font-medium leading-snug tracking-tight text-zinc-100">
						{t('apprends')}
						<br />
						<span className="text-zinc-500">{t('apprends-part2')}</span>
					</p>
					<p className="mt-6 text-sm leading-relaxed text-zinc-400">
						{t('home-page-presentation', 'Des cours écrits par les membres, pour les membres. Suis ceux qui\n\t\t\t\t\t\tt\'intéressent, publie les tiens, et vérifie ce que tu as retenu.')}
					</p>
				</div>

				<dl className="grid grid-cols-3 gap-6 border-t border-zinc-800 pt-8 font-mono text-xs">
					<div>
						{t('suivezLesCoursDeLaCommunaut', 'Suivez les cours de la communauté')}
					</div>
					<div>
						{t('publish-your-courses', 'Publiez vos propres cours')}
					</div>
					<div>
						{t('testezVosConnaissances', 'Testez vos connaissances')}
					</div>
				</dl>
			</aside>

			<main className="flex items-center justify-center px-6 py-16">
				<div className="w-full max-w-[380px]">
					<div className="mb-10 flex items-center gap-2.5 lg:hidden">
						<span className="size-2 rounded-full bg-emerald-500" />
						<span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
							Raiders.io
						</span>
					</div>
					<h1 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground">
						{title}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
					<div className="mt-9">{children}</div>
					<div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
						{footer}
					</div>
				</div>
			</main>
			</div>
		</>
	)
}