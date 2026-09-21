import { notFound } from 'next/navigation'

/**
 * Unmatched URLs never enter a route-group `not-found.tsx` on their own
 * (Next only uses root `app/not-found` for that). This catch-all routes
 * unknown paths through the frontend layout, then triggers our custom 404.
 */
export default function NotFoundCatchAll() {
  notFound()
}
