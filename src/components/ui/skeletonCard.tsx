import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface SkeletonCardProps {
  className?: string 
}

export default function SkeletonCard({className}: SkeletonCardProps) {
  const [ randomNum ] = useState(() => getRandomInt(1, 5))
  return (
    <Card className={`flex h-full flex-col overflow-hidden ${className}`}>
      <CardHeader className='flex-1'>
        <Skeleton className="h-8 w-full center" />
      </CardHeader>
      <CardDescription className='px-2'>
        <Skeleton className="h-14 text-center " />
      </CardDescription>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
        {Array.from({ length: randomNum }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-10" />
        ))}
        </div>
      </CardContent>
      <CardFooter className='mt-auto'>
        <div className='flex gap-2'>
        <h1>Lesson created by:</h1>
        <Skeleton className="h-6 w-12" />
        </div>
      </CardFooter>
    </Card>
  )
}
