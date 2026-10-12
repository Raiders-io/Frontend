import type { ExamType } from "@/utils/types/exam"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ExamCardProps {
  exam: ExamType
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{exam.name || "Untitled exam"}</CardTitle>
        <CardDescription>
          {exam.description?.trim() || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exam.createdAt
          ? `Created ${new Date(exam.createdAt).toLocaleDateString()}`
          : "No creation date"}
      </CardContent>
    </Card>
  )
}
