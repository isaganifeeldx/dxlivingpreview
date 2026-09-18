import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Where,
} from 'payload'
import { APIError } from 'payload'
import {
  adminOnlyApiView,
  isAdmin,
  isAdminBoolean,
  isAdminUser,
  isLoggedInBoolean,
  type AuthUser,
  type UserRole,
} from '@/access'

const isProd = process.env.NODE_ENV === 'production'

const ensureFirstUserIsAdmin: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!data) return data

  if (operation === 'create') {
    const existing = await req.payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      data.role = 'admin'
    } else if (!data.role) {
      data.role = 'editor'
    }
    return data
  }

  // Existing accounts created before roles existed → treat as admin once.
  if (operation === 'update' && !data.role && !originalDoc?.role) {
    data.role = 'admin'
  }

  return data
}

/** Safety net: sole account must stay admin so Users nav isn't hidden forever. */
const promoteSoleUserToAdmin: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const existing = await req.payload.find({
    collection: 'users',
    limit: 2,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs === 1 && doc.role !== 'admin') {
    return req.payload.update({
      collection: 'users',
      id: doc.id,
      data: { role: 'admin' },
      overrideAccess: true,
      depth: 0,
    })
  }

  return doc
}

/** Non-admins cannot change roles; only admins create users (except first user). */
const protectRoleChanges: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
  originalDoc,
}) => {
  if (!data) return data

  const actor = req.user as AuthUser | null

  if (operation === 'create') {
    const existing = await req.payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      data.role = 'admin'
      return data
    }

    if (!isAdminUser(actor)) {
      throw new APIError('Only admins can create users.', 403)
    }

    const role = data.role as UserRole | undefined
    if (role !== 'admin' && role !== 'editor') {
      data.role = 'editor'
    }
    return data
  }

  if (operation === 'update' && !isAdminUser(actor)) {
    // Preserve existing role; editors can update their own profile/password only.
    data.role = originalDoc?.role ?? 'editor'
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
    // Editors manage content only; user management stays in the admin nav for admins.
    hidden: ({ user }) => !isAdminUser(user as AuthUser | null),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  auth: {
    // Required for HTTPS admin sessions on Vercel; keep lax for same-site admin+API.
    cookies: {
      sameSite: 'Lax',
      secure: isProd,
    },
  },
  hooks: {
    beforeValidate: [ensureFirstUserIsAdmin],
    beforeChange: [protectRoleChanges],
    afterChange: [promoteSoleUserToAdmin],
  },
  // No public self-registration. First user still works via /admin create-first-user
  // (Payload uses overrideAccess). Extra users: admins only, with role admin | editor.
  access: {
    admin: isLoggedInBoolean,
    create: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isAdminUser(user as AuthUser)) return true
      // Editors may read their own account (password / profile).
      return { id: { equals: user.id } } satisfies Where
    },
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdminUser(user as AuthUser)) return true
      return String(user.id) === String(id)
    },
    delete: isAdmin,
    unlock: isAdminBoolean,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      // Needed so admin UI / access checks see role on the session user.
      // Without this, Users create can render a blank document view.
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Admins choose role when creating/editing users. Editors never see or change it.
        // Allow with no req.user so /admin create-first-user can set role=admin
        // (otherwise defaultValue "editor" sticks and Users stays hidden forever).
        create: ({ req: { user } }) =>
          !user || isAdminUser(user as AuthUser | null),
        read: ({ req: { user } }) => isAdminUser(user as AuthUser | null),
        update: ({ req: { user } }) => isAdminUser(user as AuthUser | null),
      },
      admin: {
        description:
          'Admins can manage users and all content. Editors can edit content but not manage users.',
        position: 'sidebar',
      },
    },
  ],
}
