import PaginatedGrid from "@/components/search/PaginatedGrid"
import { useSearchResource } from "@/utils/hooks/useSearchResource"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import { getSearchItemKey, renderSearchItem } from "@/utils/utils/searchItem"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutGrid, List } from "lucide-react"
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const { page, limit, setPage } = useSearchQueryParams()
  const useExamMock = import.meta.env.DEV && searchParams.get("mock") === "exams"
  const { items: serializedItems, total, loading } = useSearchResource({ useMock: useExamMock })

  // State to toggle between 'grid' (default card) and 'list' (preview/inline card)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <BackgroundPanel
      title="Search Results"
      controls={<SelectPanel
        options={['grid', 'list']}
        viewMode={viewMode}
        setViewMode={setViewMode}
        render={(viewMode) => {
          switch (viewMode) {
            case 'grid':
              return <LayoutGrid className='h-8 w-8' />
            case 'list':
              return <List className="h-4 w-4" />
          }
        }}
      />
      }
    >
      <PaginatedGrid
        items={serializedItems}
        loading={loading}
        limit={limit}
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        renderItem={(item) => renderSearchItem(item, viewMode === 'grid' ? 'default' : 'preview')}
        getKey={getSearchItemKey}
        onPageChange={setPage}
        layout={viewMode}
      />
    </BackgroundPanel>
  )
}
