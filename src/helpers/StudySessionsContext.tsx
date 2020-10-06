import { Remove } from '@material-ui/icons'
import * as React from 'react'
import { getRandomId } from './utility'
import { Group, Assessment, StudySession } from '../types/types'
import { group } from 'console'

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
  RemoveGroup = 'REMOVE_GROUP',
  SetActiveGroup = 'SET_ACTIVE_GROUP',
  RenameGroup = 'RENAME_GROUP',
  AddSession = 'ADD_SESSION',
  RemoveSession = 'REMOVE_SESSION',
  SetActiveSession = 'SEAT_ACTIVE_SESSION',
  UpdateSessionName = 'UPDATE_SESSION_NAME',
  UpdateAssessments = 'UPDATE_ASSESSMENTS',
}

type ActionPayload = {
  [Types.AddGroup]: {
    isMakeActive: boolean
  }
  [Types.RemoveGroup]: {
    id: string
  }
  [Types.SetActiveGroup]: {
    id: string
  }
  [Types.RenameGroup]: {
    id: string
    name: string
  }
  [Types.AddSession]: {
    name: string
    assessments: Assessment[]
    active?: boolean
  }
  [Types.RemoveSession]: {
    sessionId: string
  }
  [Types.SetActiveSession]: {
    sessionId: string
  }
  [Types.UpdateSessionName]: {
    sessionId: string
    sessionName: string
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

function addGroup(groups: Group[], isMakeActive: boolean): Group[] {

  const newId = getRandomId()
  let newGroups = [
    ...groups,
    {
      id: newId,
      active: false,
      name: `Group ${groups.length + 1}`,
      sessions: [],
    } as Group,
  ]
  if (isMakeActive) {
    newGroups = newGroups.map(group => ({
      ...group,
      active: group.id === newId,
    }))
  }
  return newGroups
}

function removeGroup(groups: Group[], groupId: string): Group[] {
 return   groups.filter(group => group.id !== groupId)
 
}

function setActiveGroup(groups: Group[], groupId: string): Group[] {
  console.log('active bein set')
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

function renameGroup(groups: Group[], groupId: string, name: string): Group[] {

  const newGroups = groups.map(group => {
    if (group.id !== groupId) {
  
      return group
    } else {
      
      return {...group, name: name}
    }
  })
  return newGroups
}

function addSession(
  groups: Group[],
  name: string,
  assessments: Assessment[],
  isActive: boolean = false,
): Group[] {
  const session: StudySession = {
    id: getRandomId(),
    assessments,
    active: isActive,
    duration: 0,
    name,
  }
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

function setActiveSession(groups: Group[], sessionId: string): Group[] {
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

function updateSessionName(groups: Group[], sessionId: string, sessionName: string): Group[] {
 
  const newGroups = groups.map(group => {
    if (group.active) {
      group.sessions = group.sessions.map(session => {
        if(session.id!== sessionId) {
          return session
        } else {
          return {...session, name: sessionName}
        }
      })
    }
    return group
  })

  return newGroups
}





function removeSession(groups: Group[], sessionId: string): Group[] {
  const updatedGroups = groups.map(group => {
    if (!group.active) {
      return group
    }
    const sessions = group.sessions.filter(session => session.id !== sessionId)
    group.sessions = [...sessions]
    return group
  })
  return updatedGroups
}

function updateAssessments(
  groups: Group[],
  sessionId: string,
  assessments: Assessment[],
): Group[] {
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
      return addGroup(groups, action.payload.isMakeActive)
    }
    case Types.SetActiveGroup: {
      return setActiveGroup(groups, action.payload.id)
    }

    case Types.RenameGroup: {
      return renameGroup(groups, action.payload.id, action.payload.name)
    }


    case Types.RemoveGroup: {
      return removeGroup(groups, action.payload.id)
    }
    case Types.AddSession: {
      return addSession(
        groups,
        action.payload.name,
        action.payload.assessments,
        action.payload.active,
      )
    }
    case Types.SetActiveSession: {
      return setActiveSession(groups, action.payload.sessionId)
    }

    case Types.UpdateSessionName: {
      return updateSessionName(groups, action.payload.sessionId, action.payload.sessionName)
    }

    case Types.RemoveSession: {
      return removeSession(groups, action.payload.sessionId)
    }
    case Types.UpdateAssessments: {
      return updateAssessments(
        groups,
        action.payload.sessionId,
        action.payload.assessments,
      )
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
  defaultGroup,
  actionsReducer,
}
