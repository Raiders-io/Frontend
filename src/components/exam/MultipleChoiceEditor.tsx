import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { QuestionChoice } from '@/utils/types/exam'

type MultipleChoiceEditorProps = 
{
    choices: QuestionChoice[]
    currentChoice: string
    onCurrentChoiceChange: (value: string) => void
    onAddChoice: () => void
    onToggleChoice: (choiceId: string) => void
    onRemoveChoice: (choiceId: string) => void
}

export function MultipleChoiceEditor({
    choices,
    currentChoice,
    onCurrentChoiceChange,
    onAddChoice,
    onToggleChoice,
    onRemoveChoice,
}: MultipleChoiceEditorProps)
{
    return (
        <>
            <div className="flex gap-2">
                <Input
                    value={currentChoice}
                    onChange={(event) => onCurrentChoiceChange(event.target.value)}
                    placeholder="Ajouter un choix de réponse"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            onAddChoice()
                        }
                    }}
                />
                <Button type="button" onClick={onAddChoice}>+</Button>
            </div>

            {choices.length > 0 && (
                <div className="border rounded-md p-2 bg-gray-50">
                    <p className="font-semibold text-sm mb-2">Choix disponibles:</p>
                    {choices.map((choice) => (
                        <div key={choice.id} className="flex justify-between items-center gap-2 mb-2">
                            <label className="flex items-center gap-2 flex-1">
                                <input type="checkbox" checked={choice.isCorrect} onChange={() => onToggleChoice(choice.id)} />
                                <span>{choice.text}</span>
                            </label>
                            <Button type="button" variant="outline" size="sm" onClick={() => onRemoveChoice(choice.id)}>
                                Supprimer
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button type="submit" disabled={choices.length < 2 || !choices.some((choice) => choice.isCorrect)}>
                Submit
            </Button>
        </>
    )
}