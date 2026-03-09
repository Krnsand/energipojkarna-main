import { useEffect, useCallback } from 'react'

export const useOnEscClick = (enabled, handler) => {
  const onEscClick = useCallback(
    event => {
      if (event.keyCode === 27) {
        handler(event)
      }
    },
    [handler],
  )

  const subscribe = useCallback(
    () => document.addEventListener('keydown', onEscClick, false),
    [onEscClick],
  )

  const unsubscribe = useCallback(
    () => document.removeEventListener('keydown', onEscClick, false),
    [onEscClick],
  )

  useEffect(() => {
    if (enabled) {
      subscribe(handler)
    }
    return unsubscribe
  }, [handler, enabled, subscribe, unsubscribe])

  return unsubscribe
}
