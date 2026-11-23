const KEYFRAMES: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-8px)" },
  { transform: "translateX(8px)" },
  { transform: "translateX(-6px)" },
  { transform: "translateX(6px)" },
  { transform: "translateX(0)" },
]

/**
 * Shakes an element (e.g. a form after a failed submit).
 * Don't use it on a Radix DialogContent: Radix already uses `transform` to
 * center it. Target an inner element such as the <form>.
 */
export function shake(el: HTMLElement | null) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  el.animate(KEYFRAMES, { duration: 380, easing: "ease-in-out" })
}
