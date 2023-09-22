import React, {useCallback, useEffect, useRef} from 'react'
import {useUserSessionDataDispatch, useUserSessionDataState} from './helpers/AuthContext'
import Utility from './helpers/utility'
import UserService from './services/user.service'
import {ExtendedError, LoggedInUserData, LoginMethod} from './types/types'

export type UsernameAndPasswordLogin = {
  isLoading: boolean
  errorMessage: string | undefined
  onSubmit: (username: string, password: string) => void
}

export type UseLoginReturn = {
  id: string
  redirect: string | undefined
  isLoadingLoginWithOauth: boolean
  usernameAndPasswordLogin: UsernameAndPasswordLogin
}

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

function useLogin(): UseLoginReturn {
  const firstUpdate = useRef(true)
  const sessionData = useUserSessionDataState()
  const sessionUpdateFn = useUserSessionDataDispatch()
  const [redirect, setRedirect] = React.useState<string | undefined>()
  const [token, setToken] = React.useState(sessionData.token)
  const code = getCode()

  const [isLoadingLoginWithUsernameAndPassword, setIsLoadingLoginWithUsernameAndPassword] =
    React.useState<boolean>(false)
  const [errorMessageLoginWithUsernameAndPassword, setErrorMessageLoginWithUsernameAndPassword] = React.useState<
    string | undefined
  >()

  const finishLogin = useCallback(
    async (loginResponse: LoggedInUserData, loginMethod: LoginMethod) => {
      sessionUpdateFn({
        type: 'LOGIN',
        payload: {
          synapseUserId: loginResponse.synapseUserId,
          token: loginResponse.sessionToken,
          firstName: loginResponse.firstName,
          lastName: loginResponse.lastName,
          username: loginResponse.username,
          orgMembership: loginResponse.orgMembership,
          dataGroups: loginResponse.dataGroups,
          roles: loginResponse.roles,
          id: loginResponse.id,
          appId: Utility.getAppId(),
          demoExternalId: loginResponse.clientData?.demoExternalId,
          isVerified: loginResponse.isVerified,
          lastLoginMethod: loginMethod,
        },
      })
      setToken(loginResponse.sessionToken)
      const savedLocation = sessionStorage.getItem('location')
      if (savedLocation) {
        sessionStorage.removeItem('location')
        setRedirect(savedLocation)
      } else {
        setRedirect('/studies')
      }
    },
    [sessionUpdateFn]
  )

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
        async result => {
          await finishLogin(result, 'OAUTH_SYNAPSE')
        },
        e => {
          alert(e.message)
        }
      )
    }
  }, [sessionData.token, code, finishLogin])

  const submitUsernameAndPassword: UsernameAndPasswordLogin['onSubmit'] = async (username, password) => {
    try {
      setIsLoadingLoginWithUsernameAndPassword(true)
      setErrorMessageLoginWithUsernameAndPassword(undefined)
      const response = await UserService.loginUsernamePassword(username, password)
      await finishLogin(response, 'USERNAME_PASSWORD')
    } catch (e) {
      setErrorMessageLoginWithUsernameAndPassword(e.message)
    } finally {
      setIsLoadingLoginWithUsernameAndPassword(false)
    }
  }

  return {
    id: sessionData.id,
    redirect,
    isLoadingLoginWithOauth: !sessionData.id && code !== null,
    usernameAndPasswordLogin: {
      isLoading: isLoadingLoginWithUsernameAndPassword,
      errorMessage: errorMessageLoginWithUsernameAndPassword,
      onSubmit: submitUsernameAndPassword,
    },
  }
}

export default useLogin
