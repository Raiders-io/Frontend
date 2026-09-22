import Editor from "@monaco-editor/react"

type CodeEditorProps =
{
    value: string;
    onChange: (value: string) => void;
    language?: string;
    height?: string;
    theme?: string;
}

function CodeEditor({
    value,
    onChange,
    language,
    height = "500px",
    theme = "vs-dark",
}: CodeEditorProps) {
    return (
        <Editor
            height={height}
            defaultLanguage={language}
            value={value}
            onChange={(value) => onChange(value ?? "")}
            theme={theme}
        />
    )
}

export default CodeEditor
