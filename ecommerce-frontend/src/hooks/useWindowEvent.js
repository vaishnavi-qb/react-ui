import { useEffect } from 'react'

const useWindowEvent = (event, handler) => {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}

export default useWindowEvent
