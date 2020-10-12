import {
  Response,
  // SignInData,
  LoggedInUserData,
  //SignInDataEmail,

  // LoginType,
  StringDictionary,
  RequestStatus,
  Study,
} from '../types/types'

import CONSTANTS from '../types/constants'

import { Reducer, useState } from 'react'
import { SessionData } from '../types/types'
import React from 'react'

function makeRequest(
  method: 'POST' | 'GET' = 'POST',
  url: string,
  body: any,
  token?: string,
): Promise<any> {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = function () {
      if ((this.status >= 200 && this.status < 300) || this.status === 412) {
        resolve({ status: this.status, response: xhr.response, ok: true })
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
          message: JSON.parse(xhr.responseText).message,
        })
      }
    }
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
        message: xhr.response,
      })
    }
    //xhr.setRequestHeader('Accept-Language', i18n.language)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (token) {
      xhr.setRequestHeader('Bridge-Session', token)
    }

    xhr.send(body)
  })
}

export const callEndpointXHR = async <T>(
  endpoint: string,
  method: 'POST' | 'GET' = 'POST',
  data: StringDictionary,
  token?: string,
): Promise<Response<T>> => {
  let body: string | undefined = JSON.stringify(data)

  if (method === 'GET') {
    const queryString = Object.keys(data)
      .map(key => key + '=' + data[key])
      .join('&')
    endpoint = queryString ? `${endpoint}?${queryString}` : endpoint

    body = undefined
  }
  return makeRequest(method, endpoint, body, token).then(
    ({ status, response, ok }) => {
      const result = JSON.parse(response)
      return { status: status, data: result, ok: ok }
    },
    error => {
      throw error
    },
  )
}

export const callEndpoint = async <T>(
  endpoint: string,
  method: 'POST' | 'GET' = 'POST',
  data: StringDictionary,
  token?: string,
): Promise<Response<T>> => {
  const ls = window.localStorage
  const isE2E = ls.getItem('crc_e2e')
  let url = `${CONSTANTS.constants.ENDPOINT}${endpoint}`
  if (isE2E) {
    return callEndpointXHR(url, method, data, token)
  }
  const headers: HeadersInit = new Headers()
  //headers.set('Accept-Language', i18n.language)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Bridge-Session', token)
  }

  const config = {
    method: method, // *GET, POST, PUT, DELETE, etc.
    headers,
    body: JSON.stringify(data),
  } as any

  if (method === 'GET') {
    const queryString = Object.keys(data)
      .map(key => key + '=' + data[key])
      .join('&')
    url = queryString ? `${url}?${queryString}` : url
    delete config.body
  }

  const response = await fetch(url, config)

  const result = await response.json()
  if (!response.ok && response.status !== 412) {
    //alert(JSON.stringify(result, null, 2))
    throw result
  }
  return { status: response.status, data: result, ok: response.ok }
}

export const getSession = (): SessionData | undefined => {
  const item = sessionStorage.getItem(CONSTANTS.constants.SESSION_NAME) || ''
  try {
    const json = JSON.parse(item)
    return json
  } catch {
    return undefined
  }
}

export const clearSession = () => {
  sessionStorage.removeItem(CONSTANTS.constants.SESSION_NAME)
  sessionStorage.clear()
}

export const setSession = (data: SessionData) => {
  sessionStorage.setItem(CONSTANTS.constants.SESSION_NAME, JSON.stringify(data))
}

export const getSearchParams = (search: string): { [key: string]: string } => {
  const searchParamsProps: any = {}
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams -- needs polyfill for ie11
  const searchParams = new URLSearchParams(search)
  searchParams.forEach((value, key) => {
    searchParamsProps[key] = value
  })
  return searchParamsProps
}

// function to use session storage (react hooks)
export const useSessionStorage = (
  key: string,
  initialValue: string | undefined,
): [string | undefined, (value: string | undefined) => void] => {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      // Parse stored json or if none return initialValue
      const value = item ? item : initialValue
      if (value) {
        window.sessionStorage.setItem(key, value)
      }
      return value
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })
  // persist value to session storage
  const setValue = (value: string | undefined) => {
    try {
      setStoredValue(value)
      if (value) {
        window.sessionStorage.setItem(key, value)
      } else {
        window.sessionStorage.removeItem(key)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}

export const getRandomId = (): string => {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  console.log('newId', uint32.toString(16))
  return uint32.toString(16)
}

//async hooks

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

  // to make this even more generic you should use the useLayoutEffect hook to
  // make sure that you are correctly setting the mountedRef.current immediately
  // after React updates the DOM. Even though this effect does not interact
  // with the dom another side effect inside a useLayoutEffect which does
  // interact with the dom may depend on the value being set
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return React.useCallback(
    (...args) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

function asyncReducer<T>(_state: any, action: AsyncAction<T>): HookState<T> {
  switch (action.type) {
    case 'PENDING': {
      return { status: 'PENDING', data: null, error: null }
    }
    case 'RESOLVED': {
      return { status: 'RESOLVED', data: action.data, error: null }
    }
    case 'REJECTED': {
      return { status: 'REJECTED', data: null, error: action.error }
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

  const { data, error, status } = state

  const run = React.useCallback(
    promise => {
      dispatch({ type: 'PENDING' })
      promise.then(
        (data: T) => {
          dispatch({ type: 'RESOLVED', data })
        },
        (error: Error) => {
          dispatch({ type: 'REJECTED', error })
        },
      )
    },
    [dispatch],
  )

  const setData = React.useCallback(
    data => dispatch({ type: 'RESOLVED', data }),
    [dispatch],
  )
  const setError = React.useCallback(
    error => dispatch({ type: 'REJECTED', error }),
    [dispatch],
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
