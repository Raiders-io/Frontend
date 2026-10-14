import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

type ExactAnswerEditorProps = 
{
    answers: string[]
    currentAnswer: string
    onCurrentAnswerChange: (value: string) => void
    onAddAnswer: () => void
    onRemoveAnswer: (index: number) => void
}

export function ExactAnswerEditor({
    answers,
    currentAnswer,
    onCurrentAnswerChange,
    onAddAnswer,
    onRemoveAnswer,
}: ExactAnswerEditorProps)
{
    const { t } = useTranslation()
    return (
        <>
            <div className="flex gap-2">
                <Input
                    value={currentAnswer}
                    onChange={(event) => onCurrentAnswerChange(event.target.value)}
                    placeholder={t('ajouterUneRponsePossible', 'Ajouter une réponse possible')}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            onAddAnswer()
                        }
                    }}
                />
                <Button type="button" onClick={onAddAnswer}>+</Button>
            </div>

            {answers.length > 0 && (
                <div className="border rounded-md p-2 bg-gray-50">
                    <p className="font-semibold text-sm mb-2">{t('rponsesAcceptes', 'Réponses acceptées:')}</p>
                    {answers.map((answer, index) => (
                        <div key={`${answer}-${index}`} className="flex justify-between items-center mb-1">
                            <span>{answer}</span>
                            <Button type="button" variant="outline" size="sm" onClick={() => onRemoveAnswer(index)}>
                                {t('supprimer', 'Supprimer')}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button type="submit" disabled={answers.length === 0}>{t('submit', 'Submit')}</Button>
        </>
    )
}