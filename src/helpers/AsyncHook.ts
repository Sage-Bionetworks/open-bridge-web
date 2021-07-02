import {RequestStatus} from '../types/types'

import React from 'react'

interface AsyncAction<T> {
  type: RequestStatus
  data: T | null
  error?: Error | null
}

interface AsyncReturnType<T> {
  setData: Function
  setError: Function
  error?: Error | null | undefined
  status: RequestStatus
  data: T | null
  run: Function
}

type HookState<T> = {
  status: RequestStatus
  data: T | null
  error?: Error | null | undefined
}

function useSafeDispatch<T>(dispatch: Function): Function {
  const mountedRef = React.useRef(false)
  React.useLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(
    (...args) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch]
  )
}

function asyncReducer<T>(_state: any, action: AsyncAction<T>): HookState<T> {
  switch (action.type) {
    case 'PENDING': {
      return {status: 'PENDING', data: null, error: null}
    }
    case 'RESOLVED': {
      return {status: 'RESOLVED', data: action.data, error: null}
    }
    case 'REJECTED': {
      return {status: 'REJECTED', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export function useAsync<T>(initialState?: HookState<T>): AsyncReturnType<T> {
  const initState: HookState<T> = {
    status: 'IDLE',
    data: null,
    error: null,
    ...initialState,
  }
  const [state, unsafeDispatch] = React.useReducer<
    React.Reducer<HookState<T>, AsyncAction<T>>
  >(asyncReducer, initState)

  const dispatch = useSafeDispatch<AsyncAction<T>>(unsafeDispatch)

  const {data, error, status} = state

  const run = React.useCallback(
    promise => {
      dispatch({type: 'PENDING'})
      promise.then(
        (data: T) => {
          dispatch({type: 'RESOLVED', data})
        },
        (error: Error) => {
          dispatch({type: 'REJECTED', error})
        }
      )
    },
    [dispatch]
  )

  const setData = React.useCallback(
    data => dispatch({type: 'RESOLVED', data}),
    [dispatch]
  )
  const setError = React.useCallback(
    error => dispatch({type: 'REJECTED', error}),
    [dispatch]
  )

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  }
}
