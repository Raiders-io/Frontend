import type { CSSProperties, ReactNode } from 'react'
import { BookOpen, ListChecks, PenLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AuthLayoutProps {
    title: string
    subtitle: string
    children: ReactNode
    footer: ReactNode
}

/*
 * Same display face as the home page headline (`.rh-display`).
 * Duplicated here because the home page injects it from its own <style>:
 * move both to the global stylesheet when convenient.
 */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Young+Serif&display=swap');
.rh-display { font-family: 'Young Serif', ui-serif, Georgia, serif; font-weight: 400; }

@keyframes rh-line { from { transform: translateY(112%); } to { transform: translateY(0); } }
.rh-line { display: block; overflow: hidden; padding-bottom: .12em; margin-bottom: -.12em; }
.rh-line > span {
  display: block; transform: translateY(112%);
  animation: rh-line 1s cubic-bezier(.2,.8,.1,1) forwards;
  animation-delay: calc(var(--i, 0) * 130ms + 100ms);
}

.rh-note {
  transform: translateX(var(--x)) rotate(var(--r));
  transition: transform .5s cubic-bezier(.2,.8,.2,1);
}
.rh-notes:hover .rh-note { transform: translateX(calc(var(--x) * 2)) rotate(calc(var(--r) * 1.8)); }

@media (prefers-reduced-motion: reduce) {
  .rh-line > span { animation: none; transform: none; }
  .rh-note { transition: none; }
}
`

const NOTES = [
    { icon: BookOpen, label: 'Read', text: 'Follow community lessons', r: -2, x: 0 },
    { icon: PenLine, label: 'Publish', text: 'Share your own lessons', r: 2, x: 1 },
    { icon: ListChecks, label: 'Test', text: 'Check what you learned', r: -1.5, x: -0.75 },
]

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
    const { t } = useTranslation()
    return (
        <div className="grid w-full flex-1 min-h-[calc(100svh-8rem)] bg-background text-foreground lg:grid-cols-2">
            <style>{CSS}</style>

            {/* ------------------------------ Left: brand ------------------------------ */}
            <aside className="relative isolate hidden flex-col justify-between gap-12 overflow-hidden bg-muted/60 p-12 lg:flex xl:p-16">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-56 -left-40 -z-10 size-136 rounded-full bg-foreground/4"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 -left-12 -z-10 size-80 rounded-full bg-foreground/4"
                />

                <div className="my-auto">
                    <h2 className="rh-display text-[clamp(3.5rem,6.5vw,7rem)] leading-[0.95] tracking-[-0.02em]">
                        <span className="rh-line" style={{ '--i': 0 } as CSSProperties}>
                            <span>Learn.</span>
                        </span>
                        <span
                            className="rh-line text-muted-foreground"
                            style={{ '--i': 1 } as CSSProperties}
                        >
                            <span>{t('thenShare', 'Then share.')}</span>
                        </span>
                    </h2>
                    <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
                        {t('lessonsWrittenByMembers', 'Lessons written by members, for members. Publish your own\n                        and check what stuck with exams.')}
                    </p>
                </div>

                {/* Pile of notes, echoing the home page hero stack */}
                <ul className="rh-notes flex max-w-md list-none flex-col gap-3">
                    {NOTES.map((n) => (
                        <li
                            key={n.label}
                            className="rh-note flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-foreground/10"
                            style={
                                {
                                    '--r': `${n.r}deg`,
                                    '--x': `${n.x}rem`,
                                } as CSSProperties
                            }
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                                <n.icon className="size-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="rh-display text-lg leading-none">{n.label}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {n.text}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ------------------------------ Right: form ------------------------------ */}
            {/* <section>, not <main>: RootLayout already provides the <main> landmark. */}
            <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
                <div className="w-full max-w-sm">
                    {/* Brand line, only when the left half is hidden */}
                    <p className="rh-display mb-6 text-2xl leading-none lg:hidden">
                        Learn.{' '}
                        <span className="text-muted-foreground">{t('thenShare', 'Then share.')}</span>
                    </p>

                    <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-2 text-balance text-sm text-muted-foreground">
                        {subtitle}
                    </p>

                    <div className="mt-8">{children}</div>

                    <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                        {footer}
                    </div>
                </div>
            </section>
        </div>
    )
}