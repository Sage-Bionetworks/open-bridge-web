import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (key: string, trackingId: string, config: {page_path: string; page_location: string}) => void
  }
}

// hook to track page views on location change
export const useTracking = (trackingId: string) => {
  const location = useLocation()
  useEffect(() => {
    if (window.gtag) {
      if (!trackingId) {
        console.log('Need tracking id.')
        return
      }
      console.log(window.location.href)
      window.gtag('config', trackingId, {page_path: location.pathname, page_location: window.location.href})
    }
  }, [trackingId, location])
}
