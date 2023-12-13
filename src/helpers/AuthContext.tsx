import constants from '@typedefs/constants'
import * as React from 'react'
import {UserSessionData} from '../types/types'
import {default as Utility, default as UtilityObject} from './utility'

type ActionType = 'LOGIN' | 'LOGOUT' | 'SET_ALERT' | 'CLEAR_ALERT'

type Action = {type: ActionType; payload?: UserSessionData}
type Dispatch = (action: Action) => void
type UserSessionDataProviderProps = {children: React.ReactNode}

const initialState: UserSessionData = {
  token: undefined,
  synapseUserId: undefined,
  orgMembership: undefined,
  dataGroups: [],
  roles: [],
  id: '',
  appId: UtilityObject.getAppId(),
  demoExternalId: '',
  isVerified: false,
  lastLoginMethod: undefined,
}

const UserSessionDataStateContext = React.createContext<UserSessionData | undefined>(undefined)
const UserSessionDataDispatchContext = React.createContext<Dispatch | undefined>(undefined)

function userReducer(state: UserSessionData, action: Action): UserSessionData {
  switch (action.type) {
    case 'SET_ALERT': {
      const newState: UserSessionData = {
        ...state,
        alert: action.payload!.alert!,
      }
      Utility.setSession(newState)
      return newState
    }

    case 'CLEAR_ALERT': {
      const newState: UserSessionData = {
        ...state,
        alert: undefined,
      }
      Utility.setSession(newState)
      return newState
    }

    case 'LOGIN':
      const newState: UserSessionData = {
        ...state,
        token: action.payload!.token,
        orgMembership: action.payload!.orgMembership,
        appId: action.payload!.appId,
        firstName: action.payload!.firstName,
        lastName: action.payload!.lastName,
        username: action.payload!.username,
        dataGroups: action.payload!.dataGroups,
        roles: action.payload!.roles,
        id: action.payload!.id,
        synapseUserId: action.payload!.synapseUserId,
        isVerified: action.payload!.isVerified,
        demoExternalId: action.payload?.demoExternalId,
        lastLoginMethod: action.payload?.lastLoginMethod,
      }

      Utility.setSession({...newState, token: undefined})
      return newState

    case 'LOGOUT':
      Utility.clearSession()
      window.location.href = constants.publicPaths.SIGN_IN
      return {
        ...initialState,
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserSessionDataProvider({children}: UserSessionDataProviderProps) {
  const [state, dispatch] = React.useReducer(userReducer, Utility.getSession() || initialState)
  return (
    <UserSessionDataStateContext.Provider value={state}>
      <UserSessionDataDispatchContext.Provider value={dispatch}>{children}</UserSessionDataDispatchContext.Provider>
    </UserSessionDataStateContext.Provider>
  )
}

function useUserSessionDataState() {
  const context = React.useContext(UserSessionDataStateContext)
  if (context === undefined) {
    throw new Error('useUserSessionDataState must be used within a AuthContext')
  }
  return context
}

function useUserSessionDataDispatch() {
  const context = React.useContext(UserSessionDataDispatchContext)
  if (context === undefined) {
    throw new Error('useUserSessionDataDispatch must be used within a AuthContext')
  }
  return context
}

export {UserSessionDataProvider, useUserSessionDataState, useUserSessionDataDispatch, UserSessionDataStateContext}
