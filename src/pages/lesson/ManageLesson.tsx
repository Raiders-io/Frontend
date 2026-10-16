// import LessonCard from "@/components/lesson/LessonCard";
// import PaginatedGrid from "@/components/search/PaginatedGrid";
// import { lessonService } from "@/services/lesson_service";
// import type { SerializedSearchItem } from "@/utils/types/component";
// import type { Lesson } from "@/utils/types/lesson"
// import { useEffect, useMemo, useState } from "react"
// import { useParams } from "react-router-dom";

// export default function ManageLesson() {
//   const [items, setItems] = useState<Lesson[]>([])
//   const [loading, setLoading] = useState<boolean>(false)

//   const { author } = useParams()

//   useEffect(() => {
//     const fetcher = async () => {
//       setLoading(true)
//       if (author) {
//         try {
//           const data = await lessonService.getLessonByAuthor(author)
//           setItems(data)
//         } catch (error) {
//           console.log("An error occured: ", error)
//         }
//       }
//       setLoading(false)
//     }

//     fetcher()
//   }, [])

//   const renderItem = (item: SerializedSearchItem<Lesson>) => {
//     switch (item.kind) {
//       case "lesson":
//         return <LessonCard Lesson={item.data} />
//       default:
//         return <></>
//     }
//   }

//   const serializedLessons = useMemo(() => {
//     if (!items) return []
//     return items.map((lesson) => ({
//       kind: "lesson" as const,
//       data: lesson,
//     }))
//   }, [items])

//   return (
//     <div>
//       {/* <PaginatedGrid */}
//       {/*   items={serializedLessons} renderItem={renderItem} getKey={(item) => item.data.UUID} loading={loading}> */}
//       {/* </PaginatedGrid> */}
//     </div>
//   )
// }
