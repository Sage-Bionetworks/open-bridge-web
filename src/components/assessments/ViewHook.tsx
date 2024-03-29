import {ViewType} from '@typedefs/types'
import React from 'react'
import {useHistory} from 'react-router-dom'

export default function useViewToggle(search: string): [ViewType, () => void] {
  const history = useHistory()
  const view = new URLSearchParams(search).get('viewType')
  const [value, setValue] = React.useState<ViewType>(view === 'LIST' ? 'LIST' : 'GRID')

  const toggle = React.useCallback(() => {
    setValue(prev => {
      const val = prev === 'GRID' ? 'LIST' : 'GRID'
      history.push({search: `?viewType=${val}`})
      return val
    })
  }, [])
  return [value, toggle]
}
