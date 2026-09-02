import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function Question() 
{
    return (<CreateQuestion />)
}

export function CreateQuestion() {
    return (
        <div className="flex flex-col gap-4">
            <Input placeholder="Question" />

            <select className="border rounded-md p-2">
                <option value="multiple_choice">QCM</option>
                <option value="exact_answer">Réponse exacte</option>
                <option value="true_false">Vrai / Faux</option>
            </select>

            <Input placeholder="Answer" />

            <Button>Submit</Button>
        </div>
    )
}
