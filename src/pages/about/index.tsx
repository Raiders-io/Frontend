import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState, useEffect } from "react"
import { ReactMarkdownStyle } from "@/utils/style/ReactMarkdown"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const [markdownOrga, setMarkdownOrga] = useState<string>("")
  const [markdownProjet, setMarkdownProjet] = useState<string>("")
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
    const url2 =
      "https://raw.githubusercontent.com/Raiders-io/Transcendence/refs/heads/main/README.md"
    fetch(url2)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.text()
      })
      .then(setMarkdownProjet)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 text-center">Chargement...</div>
  if (error)
    return <div className="p-4 text-red-500 text-center">Erreur : {error}</div>

  return (
    <>
      <div className="prose dark:prose-invert max-w-none">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">À propos</h1>
          </CardHeader>
          <CardContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={ReactMarkdownStyle}
            >
              {markdownOrga}
            </ReactMarkdown>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">Project</h1>
          </CardHeader>
          <CardContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={ReactMarkdownStyle}
            >
              {markdownProjet}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
