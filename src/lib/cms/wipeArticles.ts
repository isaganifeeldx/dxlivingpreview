import type { Payload, PayloadRequest, Where } from 'payload'

export type DeleteArticlesResult = {
  deleted: number
  failed: number
  requested: number
}

async function deleteArticleIds(args: {
  ids: Array<number | string>
  overrideAccess: boolean
  payload: Payload
  req?: PayloadRequest
}): Promise<DeleteArticlesResult> {
  const { ids, overrideAccess, payload, req } = args
  const uniqueIds = [...new Set(ids.filter((id) => id != null && id !== ''))]
  let deleted = 0
  let failed = 0

  for (const id of uniqueIds) {
    try {
      await payload.delete({
        collection: 'articles',
        id,
        overrideAccess,
        req,
      })
      deleted += 1
    } catch (error) {
      failed += 1
      payload.logger.error({
        err: error,
        msg: `deleteArticles: failed to delete article id=${String(id)}`,
      })
      // Versions can still be left behind when the parent row is already gone.
      try {
        await payload.db.deleteVersions({
          collection: 'articles',
          req,
          where: {
            parent: {
              equals: id,
            },
          },
        })
      } catch {
        // ignore secondary cleanup errors
      }
    }
  }

  return {
    deleted,
    failed,
    requested: uniqueIds.length,
  }
}

/**
 * Reliably delete Articles by explicit IDs or by a where clause (draft-aware).
 * Prefer this over Payload admin REST bulk-delete, which can leave draft ghosts.
 */
export async function deleteArticles(args: {
  payload: Payload
  req?: PayloadRequest
  overrideAccess?: boolean
  /** Specific document IDs (normal checkbox selection). */
  ids?: Array<number | string>
  /**
   * When true, delete every article matching `where` (or all articles if where
   * is omitted). Used for “select all across pages”.
   */
  allMatching?: boolean
  where?: Where
}): Promise<DeleteArticlesResult> {
  const {
    payload,
    req,
    overrideAccess = true,
    ids,
    allMatching = false,
    where,
  } = args

  if (!allMatching) {
    if (!ids?.length) {
      return { deleted: 0, failed: 0, requested: 0 }
    }
    return deleteArticleIds({ ids, overrideAccess, payload, req })
  }

  const collected: Array<number | string> = []
  let page = 1

  while (page <= 200) {
    const result = await payload.find({
      collection: 'articles',
      depth: 0,
      draft: true,
      limit: 100,
      overrideAccess,
      page,
      req,
      ...(where ? { where } : {}),
    })

    for (const doc of result.docs) {
      if (doc?.id != null) collected.push(doc.id)
    }

    if (!result.hasNextPage) break
    page += 1
  }

  return deleteArticleIds({
    ids: collected,
    overrideAccess,
    payload,
    req,
  })
}

/** CLI / full wipe helper — deletes every article including drafts. */
export async function wipeAllArticles(args: {
  payload: Payload
  req?: PayloadRequest
  overrideAccess?: boolean
}): Promise<DeleteArticlesResult & { remaining: number }> {
  const result = await deleteArticles({
    ...args,
    allMatching: true,
  })

  // Clear any leftover version ghosts with null/missing parents.
  try {
    await args.payload.db.deleteVersions({
      collection: 'articles',
      req: args.req,
      where: {
        id: {
          exists: true,
        },
      },
    })
  } catch (error) {
    args.payload.logger.error({
      err: error,
      msg: 'wipeAllArticles: failed to clear article versions',
    })
  }

  const remaining = await args.payload.find({
    collection: 'articles',
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: args.overrideAccess ?? true,
    req: args.req,
  })

  return {
    ...result,
    remaining: remaining.totalDocs,
  }
}
