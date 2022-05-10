import Utility from '../helpers/utility'
import constants from '../types/constants'
import {LoggedInUserData, Response} from '../types/types'

const isLocalhost = (): boolean =>
  document.location.origin.indexOf('127.0.0.1') > -1

const isStaging = (): boolean => document.location.host.indexOf('staging.') > -1

const isArc = (): boolean =>
  document.location.host.indexOf('dashboard.sagebridge.org') > -1

const isMTB = (): boolean =>
  document.location.host.indexOf('studies.mobiletoolbox') > -1

const getOathEnvironment = (): {
  client: string
  vendor: string
  redirect: string
} => {
  //localhost
  if (isLocalhost()) {
    if (document.location.port === '3000') {
      return constants.oauth.local_mtb
    }
    if (document.location.port === '3001') {
      return constants.oauth.local_arc
    }
    throw Error('unknown local environment')
  } else {
    if (!isMTB() && !isArc()) {
      throw new Error('unknown environment')
    }
    if (isStaging()) {
      return isArc()
        ? constants.oauth.stage_arc_studies
        : constants.oauth.stage_mtb_studies
    } else {
      return isArc()
        ? constants.oauth.prod_arc_studies
        : constants.oauth.prod_mtb_studies
    }
  }
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
