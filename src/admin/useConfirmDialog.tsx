import { useState, useCallback } from 'react'
import ConfirmDialog from './ConfirmDialog'

export function useConfirmDialog() {
  const [state, setState] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)

  const ask = useCallback((title: string, message: string, onConfirm: () => void) => {
    setState({ title, message, onConfirm })
  }, [])

  const dialog = (
    <ConfirmDialog
      open={state !== null}
      title={state?.title || ''}
      message={state?.message || ''}
      onConfirm={() => {
        state?.onConfirm()
        setState(null)
      }}
      onCancel={() => setState(null)}
    />
  )

  return { ask, dialog }
}
