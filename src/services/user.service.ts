import {callEndpoint, getAppId} from '../helpers/utility'
import constants from '../types/constants'
import {LoggedInUserData, Response} from '../types/types'

const getOathEnvironment = (): {
  client: string
  vendor: string
  redirect: string
} => {
  if (document.location.origin.indexOf('127.0.0.1') > -1) {
    if (document.location.port === '3000') {
      return constants.oauth.local_mtb
    }
    if (document.location.port === '3001') {
      return constants.oauth.local_arc
    }
  } else if (document.location.origin.indexOf('staging') > -1) {
    return constants.oauth.staging_mtb
  }
  throw new Error('unknown')
}

const requestResetPassword = async (email: string): Promise<Response<{}>> => {
  const postData = {
    email,
    appId: getAppId(),
  }
  return await callEndpoint<any>(
    constants.endpoints.requestResetPassword,
    'POST',
    postData
  )
}

const loginWithPassword = async (
  email: string,
  password: string
): Promise<Response<LoggedInUserData>> => {
  const postData = {
    appId: getAppId(),
    email,
    password,
  }
  return await callEndpoint<LoggedInUserData>(
    constants.endpoints.signIn,
    'POST',
    postData
  )
}

const loginOauth = async (
  authToken: string,
  callbackUrl: string,
  vendorId: string
): Promise<Response<LoggedInUserData>> => {
  const postData = {
    appId: getAppId(),
    vendorId,
    authToken,
    callbackUrl,
  }
  console.log('token:', authToken)
  /*DO NOt CHECK IN*/
  //return loginWithPassword('username', 'password')

  const result = await callEndpoint<LoggedInUserData>(
    constants.endpoints.oauthSignIn,
    'POST',
    postData
  )

  return result
}

async function getUserInfo(token: string): Promise<Response<LoggedInUserData>> {
  const result = await callEndpoint<LoggedInUserData>(
    constants.endpoints.selfInfo,
    'GET',
    {},
    token
  )
  return result
}
const UserService = {
  getOathEnvironment,
  requestResetPassword,
  loginWithPassword,
  loginOauth,
  getUserInfo,
}

export default UserService
