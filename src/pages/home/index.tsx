import type { CSSProperties } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Flame,
  ListChecks,
  MessageCircle,
  PenLine,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import ItemGrid from "@/components/search/ItemGrid"
import LessonCard from "@/components/lesson/LessonCard"
import { lessonService } from "@/services/lesson_service"
import { useSearch } from "@/utils/hooks/useSearch"
import { useAuthStore } from "@/utils/stores/auth_store"
import { PATHS } from "@/utils/router/paths"
import type { Lesson, LessonSearchParams } from "@/utils/types/lesson"
import { useTranslation } from 'react-i18next'

/* ------------------------------------------------------------------ */
/*  Visual system                                                      */
/*                                                                     */
/*  Theme tokens only (background, card, muted, primary, ring...), so  */
/*  light/dark and the rest of the app stay consistent. Shapes follow  */
/*  the shadcn theme: rounded-lg/xl controls, rounded-3xl surfaces,    */
/*  rounded-full pills, ring-1 ring-foreground/10 instead of borders.  */
/*                                                                     */
/*  One extra: Young Serif for display headings (soft, ball-terminal   */
/*  forms that match the rounded UI). Remove the @import and           */
/*  `.rh-display` to fall back to the app font.                        */
/*                                                                     */
/*  One motion moment: the headline lines rise, then the lesson stack  */
/*  drops in. Hovering the stack fans it out.                          */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Young+Serif&display=swap');

.rh-display { font-family: 'Young Serif', ui-serif, Georgia, serif; font-weight: 400; }

@keyframes rh-line { from { transform: translateY(112%); } to { transform: translateY(0); } }
@keyframes rh-drop {
  from { opacity: 0; transform: translateY(-2.5rem) rotate(calc(var(--r) - 8deg)); }
}

.rh-line { display: block; overflow: hidden; padding-bottom: .12em; margin-bottom: -.12em; }
.rh-line > span {
  display: block; transform: translateY(112%);
  animation: rh-line 1s cubic-bezier(.2,.8,.1,1) forwards;
  animation-delay: calc(var(--i, 0) * 130ms + 100ms);
}

.rh-card {
  transform: translateX(var(--x)) rotate(var(--r));
  transition: transform .55s cubic-bezier(.2,.8,.2,1);
  animation: rh-drop .8s cubic-bezier(.2,.8,.2,1) backwards;
  animation-delay: var(--d);
}
.rh-stack:hover .rh-card,
.rh-stack:focus-within .rh-card {
  transform: translate(calc(var(--x) * 2), var(--lift)) rotate(calc(var(--r) * 1.8));
}

@media (prefers-reduced-motion: reduce) {
  .rh-line > span { animation: none; transform: none; }
  .rh-card { animation: none; transition: none; }
}
`

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: BookOpen,
    title: "Read",
    description:
      "Browse lessons written by the community. Filter by tag, sort by date or title.",
    to: `${PATHS.search}?resource=lesson`,
    cta: "Explore lessons",
  },
  {
    icon: PenLine,
    title: "Publish",
    description:
      "Write your own lessons, attach files, keep them public or private.",
    to: PATHS.lessonCreate,
    cta: "Create a lesson",
  },
  {
    icon: ListChecks,
    title: "Test",
    description:
      "Multiple choice, written answers, even C functions. Get your score instantly.",
    to: `${PATHS.search}?resource=exam`,
    cta: "Browse exams",
  },
]

const ALSO = [
  { icon: Users, title: "Community", text: "Add friends, follow what they publish" },
  { icon: MessageCircle, title: "Messaging", text: "Real-time chat between friends" },
  { icon: FileText, title: "Files", text: "Store and share pdf, md, txt, tex" },
  { icon: Flame, title: "Streaks", text: "Track your pace, keep your streak" },
]

/* Stable reference: keeps `useSearch` from refetching on every render. */
const LATEST_LESSONS_PARAMS: LessonSearchParams = {
  sortBy: "created_at",
  direction: "desc",
  page: 1,
  limit: 6,
}

const delay = (i: number) => ({ "--i": i }) as CSSProperties

/* Fan layout of the hero stack: index 0 = newest lesson, in front. */
const SLOTS = [
  { r: -1.5, x: 0, lift: 0.75 },
  { r: 2.5, x: 0.75, lift: -0.5 },
  { r: -3, x: -0.75, lift: -1.5 },
]
const CARD_H = 15 // rem, matches h-60
const PEEK = 4.5 // rem of each back card left visible

const heroBtn = "h-11 rounded-xl px-5 text-sm"

/* ------------------------------------------------------------------ */
/*  Hero stack: the three latest lessons, fanned like a pile of notes  */
/* ------------------------------------------------------------------ */

function LessonStack({
  lessons,
  loading,
}: {
  lessons: Lesson[]
  loading: boolean
}) {
  const { t } = useTranslation()
  const slots: (Lesson | null)[] = loading ? [null, null, null] : lessons.slice(0, 3)
  const n = slots.length

  if (n === 0) {
    return (
      <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-foreground/10">
        <p className="rh-display text-2xl">{t('noLessonsYet', 'No lessons yet')}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('theShelfIsEmptyBeTheFirstToPublish', 'The shelf is empty. Be the first to publish.')}
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to={PATHS.lessonCreate}>{t('createALesson', 'Create a lesson')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <ul
      className="rh-stack relative list-none"
      style={{ height: `${CARD_H + (n - 1) * PEEK + 1}rem` }}
    >
      {slots.map((lesson, k) => {
        const s = SLOTS[k]
        const style = {
          top: `${(n - 1 - k) * PEEK}rem`,
          zIndex: n - k,
          "--r": `${s.r}deg`,
          "--x": `${s.x}rem`,
          "--lift": `${s.lift}rem`,
          "--d": `${420 + (n - 1 - k) * 140}ms`,
        } as CSSProperties
        const description = lesson?.description?.trim()

        return (
          <li
            key={lesson?.lessonId ?? `skeleton-${k}`}
            className="rh-card absolute inset-x-0 mx-auto w-[92%]"
            style={style}
          >
            {lesson ? (
              <Link
                to={PATHS.lessonView(lesson.author.username, lesson.slug)}
                className="flex h-60 flex-col rounded-3xl bg-card p-6 text-card-foreground shadow-lg ring-1 ring-foreground/10 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <h3 className="rh-display line-clamp-2 text-2xl leading-tight">
                  {lesson.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {description || t('noDescriptionProvided', 'No description provided.')}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex min-w-0 gap-1.5">
                    {lesson.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{t('username', '@{{username}}', { username: lesson.author.username })}</span>
                </div>
              </Link>
            ) : (
              <div className="flex h-60 flex-col gap-3 rounded-3xl bg-card p-6 shadow-lg ring-1 ring-foreground/10">
                <Skeleton className="h-7 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-3 w-5/6 rounded-full" />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => !!s.user)

  // Same hook + service the search page already relies on
  const {
    items: latestLessons,
    total,
    loading,
    error,
  } = useSearch<LessonSearchParams, Lesson>(
    LATEST_LESSONS_PARAMS,
    lessonService.searchLessons,
  )

  const hasTotal = !loading && !error && total > 0

  return (
    <div className="relative isolate overflow-x-clip bg-background text-foreground">
      <style>{CSS}</style>

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {hasTotal && (
              <Link
                to={`${PATHS.search}?resource=lesson`}
                className="mb-8 inline-flex items-center gap-2 rounded-full bg-muted py-1.5 pl-3 pr-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <BookOpen className="size-4" />{t('totalLessonsWrittenByTheCommunity', '{{total}} lessons written by the community', { total })}<ArrowUpRight className="size-4" />
              </Link>
            )}

            <h1 className="rh-display text-[clamp(3.4rem,8.5vw,7.5rem)] leading-[0.95] tracking-[-0.02em]">
              <span className="rh-line" style={delay(0)}>
                <span>Learn.</span>
              </span>
              <span className="rh-line text-muted-foreground" style={delay(1)}>
                <span>{t('thenShare', 'Then share.')}</span>
              </span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              {t('raidersOnlinePlatform', 'Raiders.io is an online course platform. Read what the community\n              writes, publish your own lessons, and check what stuck with\n              exams.')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Button asChild className={heroBtn}>
                    <Link to={PATHS.lessonCreate}>{t('writeALesson', 'Write a lesson')}</Link>
                  </Button>
                  <Button asChild variant="outline" className={heroBtn}>
                    <Link to={PATHS.myLesson}>{t('myLessons', 'My lessons')}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className={heroBtn}>
                    <Link to={PATHS.signup}>{t('createAnAccount', 'Create an account')}</Link>
                  </Button>
                  <Button asChild variant="outline" className={heroBtn}>
                    <Link to={`${PATHS.search}?resource=lesson`}>
                      {t('browseLessons', 'Browse lessons')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-muted/60 px-6 pb-8 pt-10 ring-1 ring-foreground/10 sm:px-10">
            <LessonStack lessons={latestLessons} loading={loading && !error} />
          </div>
        </div>
      </section>

      {/* ------------------------------ Steps ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="rh-display max-w-2xl text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {t('readItWriteItTestIt', 'Read it, write it, test it.')}
        </h2>

        <div className="mt-10 grid gap-1 rounded-[2rem] bg-muted/50 p-2 ring-1 ring-foreground/10 md:grid-cols-3">
          {STEPS.map((step) => (
            <Link
              key={step.title}
              to={step.to}
              className="group flex flex-col gap-6 rounded-3xl p-6 outline-none transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-card ring-1 ring-foreground/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="size-5" />
              </span>
              <div>
                <h3 className="rh-display text-3xl">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <span className="mt-auto flex items-center justify-between text-sm font-medium">
                {step.cta}
                <span className="flex size-8 items-center justify-center rounded-full bg-background ring-1 ring-foreground/10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {ALSO.map((f) => (
            <li
              key={f.title}
              className="flex items-center gap-2 rounded-full bg-muted py-2 pl-3 pr-4 text-sm"
            >
              <f.icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="font-medium">{f.title}</span>
              <span className="hidden text-muted-foreground sm:inline">
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------ Latest lessons ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="rh-display text-4xl leading-none tracking-tight sm:text-5xl">
            {t('latestLessons', 'Latest lessons')}
          </h2>
          <Button asChild variant="outline" className="h-10 rounded-full px-5">
            <Link to={`${PATHS.search}?resource=lesson&sort=created_at&order=desc`}>
              {t('viewAll', 'View all')}
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {error ? (
            <Empty className="rounded-3xl border bg-card">
              <EmptyHeader>
                <EmptyTitle>{t('unableToLoadLessons', 'Unable to load lessons')}</EmptyTitle>
                <EmptyDescription>
                  {t('theLatestLessonsCouldNotBeRetrievedPleaseTryAgainLater', 'The latest lessons could not be retrieved. Please try again\n                  later.')}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGrid
              items={latestLessons}
              loading={loading}
              skeletonCount={LATEST_LESSONS_PARAMS.limit}
              getKey={(lesson) => lesson.lessonId}
              renderItem={(lesson) => <LessonCard lesson={lesson} />}
              emptyState={
                <Empty className="rounded-3xl border bg-card">
                  <EmptyHeader>
                    <EmptyTitle>{t('noLessonsYet', 'No lessons yet')}</EmptyTitle>
                    <EmptyDescription>
                      {t('nothingHasBeenPublishedSoFarBeTheFirst', 'Nothing has been published so far. Be the first.')}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild size="sm">
                      <Link to={PATHS.lessonCreate}>{t('createALesson', 'Create a lesson')}</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              }
            />
          )}
        </div>
      </section>

      {/* ------------------------------ Final CTA ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -right-32 size-[30rem] rounded-full bg-primary-foreground/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-8 size-72 rounded-full bg-primary-foreground/5"
          />

          <h2 className="rh-display relative max-w-3xl text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.02em]">
            {isAuthenticated ? t('yourTurnToTeach', 'Your turn to teach.') : t('yourTurn', 'Your turn.')}
          </h2>
          <p className="relative mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/70">
            {isAuthenticated
              ? t('publishALessonOrBuildAnExamToTestOtherMembers', 'Publish a lesson or build an exam to test other members.')
              : t('createAccountForLesson', 'Create an account, follow the lessons you care about and publish your own.')}
          </p>

          <div className="relative mt-8 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Button asChild variant="secondary" className={heroBtn}>
                  <Link to={PATHS.lessonCreate}>{t('writeALesson', 'Write a lesson')}</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={`${heroBtn} text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground`}
                >
                  <Link to={PATHS.examAuthoring}>{t('buildAnExam', 'Build an exam')}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="secondary" className={heroBtn}>
                  <Link to={PATHS.signup}>{t('createAnAccount', 'Create an account')}</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={`${heroBtn} text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground`}
                >
                  <Link to={PATHS.login}>{t('logIn', 'Log in')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}