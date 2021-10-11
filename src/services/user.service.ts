import Utility from '../helpers/utility'
import constants from '../types/constants'
import {LoggedInUserData, Response} from '../types/types'

const getOathEnvironment = (): {
  client: string
  vendor: string
  redirect: string
} => {
  //localhost
  if (document.location.origin.indexOf('127.0.0.1') > -1) {
    if (document.location.port === '3000') {
      return constants.oauth.local_mtb
    }
    if (document.location.port === '3001') {
      return constants.oauth.local_arc
    }
  } else {
    //staging
    if (document.location.origin.indexOf('staging.mobiletoolbox') > -1) {
      return constants.oauth.staging_mtb
    } else if (
      document.location.origin.indexOf('staging.studies.mobiletoolbox') > -1
    ) {
      return constants.oauth.staging_mtb_studies
    }
  }
  throw new Error('unknown')
}

const requestResetPassword = async (email: string): Promise<Response<{}>> => {
  const postData = {
    email,
    appId: Utility.getAppId(),
  }
  return await Utility.callEndpoint<any>(
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
    appId: Utility.getAppId(),
    email,
    password,
  }
  return await Utility.callEndpoint<LoggedInUserData>(
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
    appId: Utility.getAppId(),
    vendorId,
    authToken,
    callbackUrl,
  }

  const result = await Utility.callEndpoint<LoggedInUserData>(
    constants.endpoints.oauthSignIn,
    'POST',
    postData
  )

  return result
}

async function getUserInfo(token: string): Promise<Response<LoggedInUserData>> {
  const result = await Utility.callEndpoint<LoggedInUserData>(
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
