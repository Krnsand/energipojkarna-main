import { useEventListener } from '@/lib/hooks'

export const useOnClickOutside = (ref, handler) => {
  useEventListener('mousedown', event => {
    const el = ref?.current

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target)) {
      return
    }

    // Explicit type for "mousedown" event.
    handler(event)
  })
}
