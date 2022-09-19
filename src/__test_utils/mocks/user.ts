import constants from '@typedefs/constants'
import {UserSessionData} from '@typedefs/types'

export const loggedInSessionData: UserSessionData = {
  token: 'token_123',
  orgMembership: '123',
  roles: ['org_admin'],
  id: '123',
  appId: constants.constants.MTB_APP_ID,
}

export const notLoggedInSessionData: UserSessionData = {
  token: undefined,
  orgMembership: undefined,
  roles: [],
  id: '123',
  appId: '123',
}
