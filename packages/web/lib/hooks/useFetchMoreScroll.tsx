import { useEffect, useRef, useState } from 'react'

export const useFetchMore = (
  fetchNextPage: () => void,
  // fetchPreviousPage: () => void,
  delay = 500
): void => {
  const [first, setFirst] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const throttleTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const callbackInternal = (): void => {
      const { scrollTop, scrollHeight, clientHeight } =
        window.document.documentElement
      const direction = scrollTop > lastScrollTop ? 'down' : 'up'
      setLastScrollTop(scrollTop)

      if (
        direction == 'down' &&
        scrollTop + clientHeight >= scrollHeight - scrollHeight / 3
      ) {
        fetchNextPage()
      } /* else if (direction == 'up' && scrollTop < 300) {
        console.log('calling fetchPrevious: ', scrollTop)
        fetchPreviousPage()
      } */

      throttleTimeout.current = undefined
    }

    const handleScroll = () => {
      if (first) {
        setFirst(false)
        callbackInternal()
        return
      }
      if (typeof throttleTimeout.current === 'undefined') {
        throttleTimeout.current = setTimeout(callbackInternal, delay)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, /* fetchPreviousPage, */ delay, first, setFirst])
}
