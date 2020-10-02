import { Remove } from '@material-ui/icons'
import * as React from 'react'
import { Group, Assessment, StudySession } from '../types/types'

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export enum Types {
  AddGroup = 'ADD_GROUP',
  SetActiveGroup = 'SET_ACTIVE_GROUP',
  AddSession = 'ADD_SESSION',
  RemoveSession = 'REMOVE_SESSION',
  SetActiveSession = 'SEAT_ACTIVE_SESSION',
  UpdateAssessments = 'UPDATE_ASSESSMENTS',
}

type ActionPayload = {
  [Types.AddGroup]: {
    id: string
    isMakeActive: boolean
  }
  [Types.SetActiveGroup]: {
    id: string
  }
  [Types.AddSession]: {
    session: StudySession
  }
  [Types.RemoveSession]: {
    sessionId: string
  }
  [Types.SetActiveSession]: {
    sessionId: string
  }
  [Types.UpdateAssessments]: {
    sessionId: string
    assessments: Assessment[]
  }
}

export type SessionAction = ActionMap<ActionPayload>[keyof ActionMap<
  ActionPayload
>]

type Dispatch = (action: SessionAction) => void
type StudySessionsProviderProps = { children: React.ReactNode }

const defaultGroup: Group = {
  id: '123',
  name: 'Group1',
  active: true,
  sessions: [
    {
      id: '123',
      name: 'Baseline Survey',
      duration: 30,
      active: true,
      assessments: [
        {
          id: '0',
          img: 'string1',
          type: 'string1',
          title: 'Memory for Sequences',
          duration: '5',
          description:
            ' Assesses working memory or capacity to process information across a series of tasks and modalities',
          validation: 'true',
          study_number: '45',
        },
      ],
    },
  ],
}

const initialState: Group[] = [defaultGroup]

const StudySessionsStateContext = React.createContext<Group[] | undefined>(
  undefined,
)
const StudySessionsDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)

function addGroup(
  groups: Group[],
  groupId: string,
  isMakeActive: boolean,
): Group[] {
  let newGroups = [
    ...groups,
    {
      id: groupId,
      active: false,
      name: `Group ${groups.length + 1}`,
      sessions: [],
    } as Group,
  ]
  if (isMakeActive) {
    newGroups = newGroups.map(group => ({
      ...group,
      active: group.id === groupId,
    }))
  }
  return newGroups
}

function setActiveGroup(groups: Group[], groupId: string): Group[] {
  const newGroups = groups.map(group => {
    if (group.id !== groupId) {
      if (group.active) {
        group.sessions.forEach(session => (session.active = false))
        group.active = false
      }
      return group
    } else {
      group.active = true
      if (group.sessions?.length > 0) {
        group.sessions[0].active = true
      }
      return group
    }
  })
  return newGroups
}

function AddSession(groups: Group[], session: StudySession): Group[] {
  const newGroups = groups.map(group => {
    if (group.active) {
      group.sessions = [
        ...group.sessions.map(session => ({ ...session, active: false })),
        {
          ...session,
        },
      ]
    }
    return group
  })
  return newGroups
}

function SetActiveSession(groups: Group[], sessionId: string): Group[] {
  const newGroups = groups.map(group => {
    if (group.active) {
      group.sessions = group.sessions.map(session => ({
        ...session,
        active: session.id === sessionId,
      }))
    }
    return group
  })
  return newGroups
}


function RemoveSession(groups: Group[], sessionId: string): Group[] {
    const updatedGroups = groups.map(group => {
        if (!group.active) {
          return group
        }
        const sessions = group.sessions.filter(
          session => session.id !== sessionId,
        )
        group.sessions = [...sessions]
        return group
      })
    return updatedGroups
  }



  function UpdateAssessments(groups: Group[], sessionId: string, assessments: Assessment[]): Group[] {
    const updatedGroups = groups.map(group => {
        if (!group.active) {
          return group
        }
        const sessions = group.sessions.map(session => {
          if (session.id !== sessionId) {
            return session
          } else {
            return { ...session, assessments: assessments }
          }
        })
        group.sessions = [...sessions]
        return group
      })
    return updatedGroups
  }

function actionsReducer(groups: Group[], action: SessionAction): Group[] {
  switch (action.type) {
    case Types.AddGroup: {
      return addGroup(groups, action.payload.id, action.payload.isMakeActive)
    }
    case Types.SetActiveGroup: {
      return setActiveGroup(groups, action.payload.id)
    }
    case Types.AddSession: {
      return AddSession(groups, action.payload.session)
    }
    case Types.SetActiveSession: {
      return SetActiveSession(groups, action.payload.sessionId)
    }

    case Types.RemoveSession: {
        return RemoveSession(groups, action.payload.sessionId)
   
    }
    case Types.UpdateAssessments: {
      return UpdateAssessments(groups, action.payload.sessionId, action.payload.assessments)
    }

  
    default: {
      throw new Error(`Unhandled action type`)
    }
  }
}

function StudySessionsProvider({ children }: StudySessionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    actionsReducer,
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
}
