import React, {useEffect, useRef} from 'react'
import {useUserSessionDataDispatch, useUserSessionDataState} from './helpers/AuthContext'
import Utility from './helpers/utility'
import UserService from './services/user.service'
import {ExtendedError, LoggedInUserData} from './types/types'

const getCode = (): string | null => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  let code: URL | null | string = new URL(window.location.href)
  // in test environment the searchParams isn't defined
  const {searchParams} = code
  return searchParams?.get('code')
}

const attemptLogin = async (code: string): Promise<LoggedInUserData> => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.

  try {
    const env = Utility.getOauthEnvironment()
    return await UserService.loginOauth(code, env.redirect, env.vendor)
  } catch (e) {
    alert((e as Error).message)
    throw e
  }
}

function useLogin() {
  const firstUpdate = useRef(true)
  const sessionData = useUserSessionDataState()
  const sessionUpdateFn = useUserSessionDataDispatch()
  const [redirect, setRedirect] = React.useState<string | undefined>()
  const [token, setToken] = React.useState(sessionData.token)
  const code = getCode()
  useEffect(() => {
    let isSubscribed = true
    //the whole point of this is to log out the user if their session ha expired on the servier
    async function getInfo(token: string | undefined) {
      if (token && isSubscribed) {
        try {
          await UserService.getUserInfo(token)
        } catch (e) {
          if ((e as ExtendedError).statusCode && e.statusCode >= 400) {
            sessionUpdateFn({
              type: 'LOGOUT',
            })
            alert('Authentication Error')
          }
        }
      }
    }
    getInfo(token)
    return () => {
      isSubscribed = false
    }
  }, [token, sessionUpdateFn])
  useEffect(() => {
    if (firstUpdate.current && code && !sessionData.token) {
      firstUpdate.current = false

      attemptLogin(code).then(
        result => {
          sessionUpdateFn({
            type: 'LOGIN',
            payload: {
              synapseUserId: result.synapseUserId,
              token: result.sessionToken,
              firstName: result.firstName,
              lastName: result.lastName,
              username: result.username,
              orgMembership: result.orgMembership,
              dataGroups: result.dataGroups,
              roles: result.roles,
              id: result.id,
              appId: Utility.getAppId(),
              demoExternalId: result.clientData?.demoExternalId,
              isVerified: result.isVerified,
            },
          })
          setToken(result.sessionToken)
          const savedLocation = sessionStorage.getItem('location')
          console.log('redirecting', savedLocation)
          if (savedLocation) {
            sessionStorage.removeItem('location')
            setRedirect(savedLocation)
          } else {
            setRedirect('/studies')
          }
        },
        e => {
          alert(e.message)
        }
      )
    }
  }, [sessionData.token, code, sessionUpdateFn])

  return {id: sessionData.id, redirect, isLoading: !sessionData.id && code !== null}
}

export default useLogin
