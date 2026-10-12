import type { ExamType } from "@/utils/types/exam"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExamCardProps {
  exam: ExamType
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{exam.name || "Untitled exam"}</CardTitle>
      </CardHeader>
      <CardContent>
        {exam.createdAt
          ? `Created ${new Date(exam.createdAt).toLocaleDateString()}`
          : "No creation date"}
      </CardContent>
    </Card>
  )
}
