import { getRandomId } from '../helpers/utility'
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
  SetGroups = 'SET_GROUPS',
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

export type ActionPayload = {
  [Types.SetGroups]: {
    groups: Group[]
  }
  [Types.AddGroup]: {
    isMakeActive: boolean
    group?: Group
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

export type GroupAction = ActionMap<ActionPayload>[keyof ActionMap<
  ActionPayload
>]

export const DEFAULT_GROUP: Group = {
  id: '123',
  name: 'Group1',
  active: true,
  sessions: [
    {
      id: '123',
      name: 'Baseline Survey',
  
      active: true,
      assessments: [
        {
          guid: '7g-e13Km5yHrtjifvhtVN60-',
          identifier: 'number-match',
          revision: 1,
          ownerId: 'sage-bionetworks',
          title: 'Number Match',
          summary:
            'Fill in items, one row at a time, according to a code/legend on the top of the screen.',
          osName: 'iPhone OS',
          validationStatus: '',
          normingStatus: '',
          tags: ['cognitive', 'episodic-memory'],
          customizationFields: {},
          createdOn: '2020-10-05T20:34:41.421Z',
          modifiedOn: '2020-10-05T20:34:41.421Z',
          deleted: false,
          version: 1,
          type: 'Assessment',
        },
      ],
    },
  ],
}

function addGroup(
  groups: Group[],
  isMakeActive: boolean,
  group?: Group,
): Group[] {
  const newId = getRandomId()
  let newGroups = [
    ...groups,
    {
      id: newId,
      active: false,
      name: group ? `${group.name} copy` : `New Group`,
      sessions: group ? [...group.sessions] : [],
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
  const currentIndex = groups.findIndex(group => group.id === groupId)
  const nextActiveIndex =
    currentIndex < groups.length - 1
      ? currentIndex
      : currentIndex - 1 >= 0
      ? currentIndex - 1
      : undefined

  const newGroups =
    nextActiveIndex !== undefined
      ? setActiveGroup(groups, groups[currentIndex - 1].id)
      : groups
  return newGroups.filter(group => group.id !== groupId)
}

function setActiveGroup(groups: Group[], groupId: string): Group[] {
  const newGroups = groups.map((group, index) => {
    if (group.id !== groupId) {
      if (group.active) {
        group.sessions.forEach(session => (session.active = false))
        group.active = false
      }
      return group
    } else {
      console.log(`group ${index} is being set to active`)
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
      return { ...group, name: name }
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

function updateSessionName(
  groups: Group[],
  sessionId: string,
  sessionName: string,
): Group[] {
  const newGroups = groups.map(group => {
    if (group.active) {
      group.sessions = group.sessions.map(session => {
        if (session.id !== sessionId) {
          return session
        } else {
          return { ...session, name: sessionName }
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

function actionsReducer(groups: Group[], action: GroupAction): Group[] {
  switch (action.type) {
    case Types.SetGroups: {
      return action.payload.groups
    }
    case Types.AddGroup: {
      return addGroup(groups, action.payload.isMakeActive, action.payload.group)
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
      return updateSessionName(
        groups,
        action.payload.sessionId,
        action.payload.sessionName,
      )
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

export default actionsReducer
