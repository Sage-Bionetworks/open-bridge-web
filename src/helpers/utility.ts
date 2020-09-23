import {
  Response,
  SignInData,
  LoggedInUserData,
  SignInDataEmail,
  APP_ID,
  LoginType,
  StringDictionary,
  SESSION_NAME,
} from '../types/types'

import { useState } from 'react'
import { SessionData } from '../types/types'

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
  if (isE2E) {
    return callEndpointXHR(endpoint, method, data, token)
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
  }

  if (method === 'GET') {
    const queryString = Object.keys(data)
      .map(key => key + '=' + data[key])
      .join('&')
    endpoint = queryString ? `${endpoint}?${queryString}` : endpoint
    delete config.body
  }

  const response = await fetch(endpoint, config)

  const result = await response.json()
  if (!response.ok && response.status !== 412) {
    //alert(JSON.stringify(result, null, 2))
    throw result
  }
  return { status: response.status, data: result, ok: response.ok }
}

export const getSession = (): SessionData | undefined => {
  const item = sessionStorage.getItem(SESSION_NAME) || ''
  try {
    const json = JSON.parse(item)
    return json
  } catch {
    return undefined
  }
}

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_NAME)
  sessionStorage.clear()
}

export const setSession = (data: SessionData) => {
  sessionStorage.setItem(SESSION_NAME, JSON.stringify(data))
}

export const sendSignInRequest = async (
  loginType: LoginType,
  phoneOrEmail: string,
  endpoint: string,
): Promise<any> => {
  let postData: SignInData
  // setLoginType(_loginType)
  /*  if (loginType === 'PHONE') {
      postData = {
        appId: APP_ID,
        phone: makePhone(phoneOrEmail),
      } as SignInDataPhone
    } else {*/
  postData = {
    appId: APP_ID,
    email: phoneOrEmail,
  } as SignInDataEmail
  // }

  try {
    return callEndpoint<LoggedInUserData>(endpoint, 'POST', postData)
  } catch (e) {
    console.log(e)

    throw e
  }
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
