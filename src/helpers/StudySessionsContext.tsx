
import * as React from 'react'

import { Group} from '../types/types'
import SessionCreatorActions, {
  DEFAULT_GROUP,
  SessionAction,
} from '../components/studies/session-creator/sessionActions'

type Dispatch = (action: SessionAction) => void
type StudySessionsProviderProps = { children: React.ReactNode }

const initialState: Group[] = [DEFAULT_GROUP]

const StudySessionsStateContext = React.createContext<Group[] | undefined>(
  undefined,
)
const StudySessionsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)

function StudySessionsProvider({ children }: StudySessionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    SessionCreatorActions,
    initialState as Group[],
  )
  return (
    <StudySessionsStateContext.Provider value={state}>
      <StudySessionsDispatchContext.Provider value={dispatch}>
        {children}
      </StudySessionsDispatchContext.Provider>
    </StudySessionsStateContext.Provider>
  )
}

function useStudySessionsState() {
  const context = React.useContext(StudySessionsStateContext)
  if (context === undefined) {
    throw new Error(
      'useStudySessionsState must be used within a StudySessionsContext',
    )
  }
  return context
}

function useStudySessionsDispatch() {
  const context = React.useContext(StudySessionsDispatchContext)
  if (context === undefined) {
    throw new Error(
      'useStudySessionsDispatch must be used within a StudySessionsContext',
    )
  }
  return context
}

export {
  StudySessionsProvider,
  useStudySessionsState,
  useStudySessionsDispatch,
  //defaultGroup,
  //actionsReducer,
}
