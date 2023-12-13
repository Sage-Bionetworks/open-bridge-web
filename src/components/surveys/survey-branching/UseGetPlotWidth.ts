import React from 'react'

export function useGetPlotWidth(ref?: React.RefObject<HTMLDivElement>) {
  // save current window width in the state object
  let [width, setWidth] = React.useState(ref?.current?.getBoundingClientRect()?.width || window.innerWidth)

  // in this case useEffect will execute only once because
  // it does not have any dependencies.

  React.useLayoutEffect(() => {
    const handleResize = () => {
      const width = ref?.current?.getBoundingClientRect().width || window.innerWidth

      setWidth(width)
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      // remove resize listener
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  return {width}
}
