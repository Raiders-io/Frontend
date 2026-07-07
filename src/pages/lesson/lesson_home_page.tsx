import React, { useEffect, useMemo, useState } from 'react'
import { lessonService } from '@/services/lesson_service'
import type { Lesson, Tag } from '@/utils/types/lesson'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, BookOpen, Search } from 'lucide-react'

type SortOption = 'created_at' | 'updated_at' | 'title' | 'name'

const sortOptions: { label: string; value: SortOption; direction: 'asc' | 'desc' }[] = [
  { label: 'Newest first', value: 'created_at', direction: 'desc' },
  { label: 'Oldest first', value: 'created_at', direction: 'asc' },
  { label: 'Title A → Z', value: 'title', direction: 'asc' },
  { label: 'Title Z → A', value: 'title', direction: 'desc' },
  { label: 'Updated first', value: 'updated_at', direction: 'desc' },
]

export default function LessonHomePage() {
  const [draftTitle, setDraftTitle] = useState('')
  const [appliedTitle, setAppliedTitle] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('created_at')
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTagsLoading, setIsTagsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: limit,
    total: 0,
  })

  useEffect(() => {
    const loadTags = async () => {
      setIsTagsLoading(true)
      try {
        const tags = await lessonService.getAllTags()
        setAvailableTags(tags)
      } catch (fetchError) {
        console.error('Unable to load tags:', fetchError)
      } finally {
        setIsTagsLoading(false)
      }
    }

    loadTags()
  }, [])

  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await lessonService.searchLessons({
          title: appliedTitle.trim() || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          page,
          limit,
          sortBy,
          direction,
        })

        setLessons(response.data)
        setPagination(response.meta)
      } catch (fetchError) {
        console.error('Database communication failed:', fetchError)
        setError('Unable to load lessons right now.')
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLessons()
  }, [appliedTitle, direction, limit, page, selectedTags, sortBy])

  const selectedSortLabel = useMemo(() => {
    return sortOptions.find((option) => option.value === sortBy && option.direction === direction)?.label ?? 'Newest first'
  }, [direction, sortBy])

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setPage(1)
    setAppliedTitle(draftTitle)
  }

  const toggleTag = (tagName: string) => {
    setPage(1)
    setSelectedTags((currentTags) =>
      currentTags.includes(tagName)
        ? currentTags.filter((currentTag) => currentTag !== tagName)
        : [...currentTags, tagName]
    )
  }

  const handleSortChange = (value: string) => {
    const nextSort = sortOptions.find((option) => `${option.value}:${option.direction}` === value)
    if (!nextSort) return

    setPage(1)
    setSortBy(nextSort.value)
    setDirection(nextSort.direction)
  }

  const clearFilters = () => {
    setDraftTitle('')
    setAppliedTitle('')
    setSelectedTags([])
    setSortBy('created_at')
    setDirection('desc')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lesson Workspace</h1>
          <p className="text-slate-500">Search lessons by name or tag, then sort and page through the backend results.</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by lesson name..."
                    className="h-11 pl-9"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="h-11 px-6">
                    Search
                  </Button>
                  <Button type="button" variant="outline" className="h-11 px-6" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Search order</Label>
                  <select
                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-slate-400"
                    value={`${sortBy}:${direction}`}
                    onChange={(event) => handleSortChange(event.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={`${option.value}:${option.direction}`} value={`${option.value}:${option.direction}`}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Selected tags</Label>
                  <div className="text-sm text-slate-500">
                    {selectedTags.length > 0 ? selectedTags.join(', ') : 'No tag filter applied'}
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <Label>Filter by tag</Label>
              <div className="flex flex-wrap gap-2">
                {isTagsLoading ? (
                  <span className="text-sm text-slate-500">Loading tags...</span>
                ) : availableTags.length > 0 ? (
                  availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name)

                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {tag.name}
                      </button>
                    )
                  })
                ) : (
                  <span className="text-sm text-slate-500">No tags available.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-slate-900">{pagination.total}</span> lessons found
            {appliedTitle.trim() ? (
              <span> for “{appliedTitle.trim()}”</span>
            ) : null}
            {selectedTags.length > 0 ? <span> filtered by {selectedTags.join(', ')}</span> : null}
          </div>
          <div>Sorted by {selectedSortLabel}</div>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
              Loading lessons...
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson) => (
              <Card key={lesson.slug} className="flex flex-col justify-between shadow-sm transition hover:border-primary">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {lesson.tags?.map((tag) => (
                      <span key={tag.id} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-tight">{lesson.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <BookOpen className="h-4 w-4" />
                    <span>{lesson.isPrivate ? 'Private Module' : 'Public Module'}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
              No lessons found. Try adjusting your filters.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Button variant="outline" onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))} disabled={isLoading || pagination.currentPage <= 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-slate-600">
            Page {pagination.currentPage} of {pagination.lastPage}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage((currentPage) => Math.min(pagination.lastPage, currentPage + 1))}
            disabled={isLoading || pagination.currentPage >= pagination.lastPage}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}