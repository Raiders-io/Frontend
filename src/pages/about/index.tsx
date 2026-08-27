import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState, useEffect } from "react"
import { ReactMarkdownStyle } from "@/utils/style/ReactMarkdown"
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
	const { t } = useTranslation()
	const [markdownOrga, setMarkdownOrga] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const url =
			"https://raw.githubusercontent.com/Raiders-io/.github/refs/heads/main/profile/README.md"
		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch")
				return res.text()
			})
			.then(setMarkdownOrga)
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false))
	}, [])

	return (
		<div className="mx-auto max-w-2xl px-6 py-16">
			<p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
			{t('about', 'About')}
			</p>
			<h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
				Description
			</h1>
			<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
				Raiders.io est une plateforme de cours en ligne. On peut y lire des cours,
				publier les siens, et tester ses connaissances. Ce projet a été réalisé
				dans le cadre du projet final du tronc commun de l'École 42 : ft_transcendence.
			</p>
			<div className="mt-12 border-t pt-10">
				{loading ? (
					<p className="text-sm text-muted-foreground">Chargement…</p>
				) : error ? (
					<p className="text-sm text-destructive">Erreur : {error}</p>
				) : (
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={ReactMarkdownStyle}
						>
							{markdownOrga}
						</ReactMarkdown>
					</div>
				)}
			</div>
		</div>
	)
}
