import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import i18next from 'i18next'

export function initExam()
{
    return (
        <div className="flex flex-col gap-4">
            <Input placeholder={i18next.t('examName', 'Exam Name')} />
            <Input placeholder={i18next.t('examDescription', 'Exam Description')} />
            <Button>{i18next.t('submit', 'Submit')}</Button>
        </div>
    )
}