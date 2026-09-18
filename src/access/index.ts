import type { Access, PayloadRequest } from 'payload'
import type { DocumentTabCondition } from 'payload'

export type UserRole = 'admin' | 'editor'

export type AuthUser = {
  id?: number | string
  role?: UserRole | null
}

export function getUserRole(user: AuthUser | null | undefined): UserRole | null {
  if (!user) return null
  // Pre-role accounts (existing first admin) keep full access.
  if (user.role == null) return 'admin'
  return user.role
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return getUserRole(user) === 'admin'
}

export function isEditorUser(user: AuthUser | null | undefined): boolean {
  return getUserRole(user) === 'editor'
}

/** Any logged-in CMS user (admin or editor). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Admin role only. */
export const isAdmin: Access = ({ req: { user } }) => isAdminUser(user as AuthUser | null)

/** Boolean-only check for auth `admin` / `unlock` access. */
export const isLoggedInBoolean = ({ req: { user } }: { req: PayloadRequest }) => Boolean(user)

export const isAdminBoolean = ({ req: { user } }: { req: PayloadRequest }) =>
  isAdminUser(user as AuthUser | null)

/** Hide document API tab for editors; admins keep it. */
export const adminOnlyApiTabCondition: DocumentTabCondition = ({ req }) =>
  isAdminUser(req.user as AuthUser | null)

/** Shared admin.components.views.edit config: API tab visible to admins only. */
export const adminOnlyApiView = {
  api: {
    tab: {
      condition: adminOnlyApiTabCondition,
    },
  },
} as const

/** Globals: public read + authenticated update (admin + editor). */
export const publicReadAuthenticatedUpdate = {
  read: () => true as boolean | Promise<boolean>,
  update: ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user),
}

/**
 * Privileged globals (e.g. Settings with tracking snippets):
 * REST/GraphQL require a logged-in CMS user; Local API still uses overrideAccess.
 */
export const authenticatedReadAuthenticatedUpdate = {
  read: ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user),
  update: ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user),
}

/** Field-level: only authenticated CMS users may read via REST/GraphQL. */
export const authenticatedFieldRead = {
  read: ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user),
}
