'use client'

import React, { useCallback, useState } from 'react'
import type { BeforeListTableClientProps, Where } from 'payload'
import {
  Button,
  ConfirmationModal,
  toast,
  useConfig,
  useListQuery,
  useModal,
  useSelection,
} from '@payloadcms/ui'

const MODAL_SLUG = 'confirm-bulk-delete-articles'

/**
 * Replaces Payload’s built-in bulk delete for Articles.
 * Deletes only the current selection (or all matching rows when “select all”
 * across pages is active), including draft/version cleanup.
 */
export default function BulkDeleteArticlesButton(
  props: BeforeListTableClientProps,
) {
  const { hasDeletePermission } = props
  const { config } = useConfig()
  const { refineListData, query } = useListQuery()
  const { openModal } = useModal()
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()
  const [busy, setBusy] = useState(false)

  const onConfirm = useCallback(async () => {
    if (busy || count < 1) return
    setBusy(true)
    try {
      const selectingAllAvailable = selectAll === 'allAvailable'
      const body = selectingAllAvailable
        ? {
            allMatching: true,
            where: (query?.where as Where | undefined) ?? undefined,
          }
        : {
            ids: selectedIDs,
          }

      const res = await fetch(`${config.routes.api}/articles/bulk-delete`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = (await res.json().catch(() => null)) as {
        deleted?: number
        failed?: number
        message?: string
        error?: string
      } | null

      if (!res.ok) {
        toast.error(data?.error || data?.message || 'Bulk delete failed')
        return
      }

      const deleted = data?.deleted ?? 0
      const failed = data?.failed ?? 0
      if (failed > 0) {
        toast.error(`Deleted ${deleted}, but ${failed} failed`)
      } else {
        toast.success(`Deleted ${deleted} article${deleted === 1 ? '' : 's'}`)
      }

      // Clear selection, then refresh the list.
      if (selectAll !== 'none') {
        toggleAll(false)
      }
      await refineListData({})
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bulk delete failed')
    } finally {
      setBusy(false)
    }
  }, [
    busy,
    config.routes.api,
    count,
    query?.where,
    refineListData,
    selectAll,
    selectedIDs,
    toggleAll,
  ])

  if (!hasDeletePermission || count < 1) return null

  const label =
    selectAll === 'allAvailable'
      ? `Delete ${count} selected (all matching)`
      : `Delete ${count} selected`

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <Button
        buttonStyle="secondary"
        disabled={busy}
        onClick={() => openModal(MODAL_SLUG)}
        size="small"
      >
        {busy ? 'Deleting…' : label}
      </Button>
      <ConfirmationModal
        body={`Permanently delete ${count} selected article${count === 1 ? '' : 's'}? Draft versions for those documents are removed too. Unselected articles are kept.`}
        confirmingLabel="Deleting…"
        confirmLabel="Delete selected"
        heading="Delete selected articles?"
        modalSlug={MODAL_SLUG}
        onConfirm={onConfirm}
      />
    </div>
  )
}
