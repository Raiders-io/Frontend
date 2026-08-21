import { type Components } from "react-markdown"

export const ReactMarkdownStyle: Components = {
  // Titres
  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
  // Paragraphes
  p: ({ children }) => <p className="mb-4">{children}</p>,
  // Listes
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  // Liens
  a: ({ children, href }) => (
    <a id={href} href={href} className="text-blue-500 hover:underline">
      {children}
    </a>
  ),
  // Code
  code: ({ children }) => (
    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
      {children}
    </code>
  ),
  // Blocs de code
  pre: ({ children }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <table className="border-collapse border border-gray-300 dark:border-gray-600 mb-4 w-full">
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 dark:border-gray-600 p-2">
      {children}
    </td>
  ),
  // Images
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="max-w-full h-auto rounded" />
  ),
  // Blocs de citation
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4">
      {children}
    </blockquote>
  ),
}
