import * as React from 'react'
import {UserSessionData} from '../types/types'
import Utility from './utility'

type ActionType = 'LOGIN' | 'LOGOUT' | 'SET_ALERT' | 'CLEAR_ALERT'
/*| 'CONSENT'
  | 'WITHDRAW'*/
type Action = {type: ActionType; payload?: UserSessionData}
type Dispatch = (action: Action) => void
type UserSessionDataProviderProps = {children: React.ReactNode}

const initialState = {
  token: undefined,
  orgMembership: undefined,
  dataGroups: [],
  roles: [],
  id: '',
}

const UserSessionDataStateContext = React.createContext<
  UserSessionData | undefined
>(undefined)
const UserSessionDataDispatchContext = React.createContext<
  Dispatch | undefined
>(undefined)

function countReducer(state: UserSessionData, action: Action): UserSessionData {
  switch (action.type) {
    case 'SET_ALERT': {
      const newState = {
        ...state,
        alert: action.payload!.alert!,
      }
      Utility.setSession(newState)
      return newState
    }

    case 'CLEAR_ALERT': {
      const newState = {
        ...state,
        alert: undefined,
      }
      Utility.setSession(newState)
      return newState
    }
    /* case 'CONSENT': {
      const newState = {
        ...state,
        consented: true,
        alert: undefined,
      }
      setSession(newState)
      return newState
    }
    case 'WITHDRAW': {
      const newState = {
        ...state,
        consented: false,
      }
      setSession(newState)
      return newState
    }*/
    case 'LOGIN':
      const newState = {
        ...state,
        token: action.payload!.token,
        orgMembership: action.payload!.orgMembership,
        //consented: action.payload!.consented,
        firstName: action.payload!.firstName,
        lastName: action.payload!.lastName,
        userName: action.payload!.userName,
        dataGroups: action.payload!.dataGroups,
        roles: action.payload!.roles,
        id: action.payload!.id,
      }

      Utility.setSession(newState)
      return newState

    case 'LOGOUT':
      Utility.clearSession()
      return {
        token: undefined,
        orgMembership: undefined,
        roles: [],
        id: '',
        dataGroups: [],
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserSessionDataProvider({children}: UserSessionDataProviderProps) {
  const [state, dispatch] = React.useReducer(
    countReducer,
    Utility.getSession() || initialState
  )
  return (
    <UserSessionDataStateContext.Provider value={state}>
      <UserSessionDataDispatchContext.Provider value={dispatch}>
        {children}
      </UserSessionDataDispatchContext.Provider>
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
    throw new Error(
      'useUserSessionDataDispatch must be used within a AuthContext'
    )
  }
  return context
}

export {
  UserSessionDataProvider,
  useUserSessionDataState,
  useUserSessionDataDispatch,
  UserSessionDataStateContext,
}
