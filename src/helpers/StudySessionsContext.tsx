import * as React from 'react'
import SessionCreatorActions, {

  SessionAction
} from '../components/studies/session-creator/sessionActions'
import { StudySession } from '../types/scheduling'


type Dispatch = (action: SessionAction) => void
type StudySessionsProviderProps = { children: React.ReactNode }

const initialState: StudySession[] = []

const StudySessionsStateContext = React.createContext<
  StudySession[] | undefined
>(undefined)
const StudySessionsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)

function StudySessionsProvider({ children }: StudySessionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    SessionCreatorActions,
    //initialState as Group[],
    initialState as StudySession[],
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
}

