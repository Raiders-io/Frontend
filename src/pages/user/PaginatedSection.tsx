import { Fragment, useCallback, useEffect, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import type { PaginationParams, Paginated } from "@/utils/types/common"
import { SectionCard } from "./SectionCard"

const PAGE_SIZE = 10
const DISABLED = "pointer-events-none opacity-50"

export function ItemRow({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle?: string
}) {
  return (
    <Item size="sm">
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {subtitle && <ItemDescription>{subtitle}</ItemDescription>}
      </ItemContent>
    </Item>
  )
}

/** 1 … 4 5 6 … 12 : première, dernière et voisines de la page courante. */
function getPages(current: number, last: number): (number | "ellipsis")[] {
  const wanted = [...new Set([1, current - 1, current, current + 1, last])]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b)
  return wanted.flatMap((p, i) => (i > 0 && p - wanted[i - 1] > 1 ? ["ellipsis" as const, p] : [p]))
}

interface Props<T extends { id: string | number }> {
  title: string
  /** Doit être stable (méthode du service ou useCallback), sinon rechargement en boucle. */
  fetcher: (params: PaginationParams) => Promise<Paginated<T>>
  emptyText: string
  errorText?: string
  renderItem: (item: T) => ReactNode
}

export function PaginatedSection<T extends { id: string | number }>({
  title,
  fetcher,
  emptyText,
  errorText = "Impossible de charger cette section.",
  renderItem,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadPage = useCallback(
    async (target: number) => {
      setLoading(true)
      try {
        const res = await fetcher({ page: target, limit: PAGE_SIZE })
        setItems(res.data)
        setPage(res.meta.current_page)
        setLastPage(res.meta.last_page)
        setTotal(res.meta.total ?? null)
        setError(false)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    [fetcher]
  )

  useEffect(() => {
    setItems([])
    void loadPage(1)
  }, [loadPage])

  const goTo = (target: number) => {
    if (loading || target < 1 || target > lastPage || target === page) return
    void loadPage(target)
  }

  const pageLink = (target: number) => ({
    href: "#",
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      goTo(target)
    },
  })

  let body: ReactNode
  if (loading && items.length === 0) {
    body = (
      <div className="space-y-2">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  } else if (error && items.length === 0) {
    body = (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Chargement impossible</EmptyTitle>
          <EmptyDescription>{errorText}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={() => void loadPage(1)}>
            Réessayer
          </Button>
        </EmptyContent>
      </Empty>
    )
  } else if (items.length === 0) {
    body = (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyDescription>{emptyText}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  } else {
    body = (
      <div className="space-y-4">
        <ItemGroup className="divide-y rounded-lg border" aria-busy={loading}>
          {items.map((item) => (
            <Fragment key={item.id}>{renderItem(item)}</Fragment>
          ))}
        </ItemGroup>

        {lastPage > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  {...pageLink(page - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? DISABLED : undefined}
                />
              </PaginationItem>
              {getPages(page, lastPage).map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink {...pageLink(p)} isActive={p === page}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  {...pageLink(page + 1)}
                  aria-disabled={page >= lastPage}
                  className={page >= lastPage ? DISABLED : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    )
  }

  return (
    <SectionCard title={title} count={total ?? undefined}>
      {body}
    </SectionCard>
  )
}
