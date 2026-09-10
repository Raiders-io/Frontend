import Editor from "@monaco-editor/react"

type CodeEditorProps =
{
    value: string
    onChange: (value: string) => void
}

function CodeEditor({ value, onChange} : CodeEditorProps)
{
    return (
        <Editor
            height="500px"
            defaultLanguage="c"
            value={value}
            onChange={(value) => onChange(value ?? '')}
            theme="vs-dark"
            />
    )
}

export default CodeEditor;