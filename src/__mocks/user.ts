import {UserSessionData} from '@typedefs/types'

export const loggedInSessionData: UserSessionData = {
  token: '123',
  orgMembership: '123',
  roles: ['org_admin'],
  id: '123',
  appId: '123',
}

export const notLoggedInSessionData: UserSessionData = {
  token: undefined,
  orgMembership: undefined,
  roles: [],
  id: '123',
  appId: '123',
}
