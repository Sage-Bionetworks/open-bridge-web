import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { LoggedInUserData, Response } from '../types/types'

const requestResetPassword = async (email: string): Promise<Response<{}>> => {
  const postData = {
    email,
    appId: constants.constants.APP_ID,
  }
  return await callEndpoint<any>(
    constants.endpoints.requestResetPassword,
    'POST',
    postData,
  )
}

const loginWithPassword = async (
  email: string,
  password: string,
): Promise<Response<LoggedInUserData>> => {
  const postData = {
    appId: 'sage-assessment-test', //constants.constants.APP_ID,
    email,
    password,
  }
  return await callEndpoint<LoggedInUserData>(
    constants.endpoints.signIn,
    'POST',
    postData,
  )
}

const loginOauth = async (
  authToken: string,
  callbackUrl: string,
): Promise<Response<LoggedInUserData>> => {
  const postData = {
    appId: constants.constants.APP_ID,
    vendorId: 'synapse',
    authToken,
    callbackUrl,
  }
  console.log('token:', authToken)
  /*DO NOt CHECK IN*/
  //return loginWithPassword('username', 'password')
  debugger
  const result = await callEndpoint<LoggedInUserData>(
    constants.endpoints.oauthSignIn,
    'POST',
    postData,
  )

  return result
}


async function getUserInfo(token: string): Promise<Response<LoggedInUserData>> {
  const result = await callEndpoint<LoggedInUserData>(
    constants.endpoints.selfInfo,
    'GET',
    {},
    token,
  )
  return result
}
const UserService = {
  requestResetPassword,
  loginWithPassword,
  loginOauth,
  getUserInfo
}

export default UserService
