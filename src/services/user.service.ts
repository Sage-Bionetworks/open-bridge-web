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
    appId: constants.constants.APP_ID,
    email,
    password,
  }

  return await callEndpoint<LoggedInUserData>(
    constants.endpoints.signIn,
    'POST',
    postData,
  )
}

const UserService = {
  requestResetPassword,
  loginWithPassword,
}

export default UserService
