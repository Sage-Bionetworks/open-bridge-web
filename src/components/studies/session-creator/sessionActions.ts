import { getRandomId } from '../../../helpers/utility'
import { Group, Assessment, StudySession } from '../../../types/types'

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
  SetSessions = 'SET_SESSIONS',

  AddSession = 'ADD_SESSION',
  RemoveSession = 'REMOVE_SESSION',
  SetActiveSession = 'SEAT_ACTIVE_SESSION',
  UpdateSessionName = 'UPDATE_SESSION_NAME',
  UpdateAssessments = 'UPDATE_ASSESSMENTS',
}

export type ActionPayload = {
  [Types.SetSessions]: {
    sessions: StudySession[]
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

function addSession(
  sessions: StudySession[],
  name: string,
  assessments: Assessment[],
  isActive: boolean = false,
): StudySession[] {
  const session: StudySession = {
    id: getRandomId(),
    assessments,
    active: isActive,
    //duration: 0,
    name,
  }

  const result = [
    ...sessions.map(session => ({ ...session, active: false })),
    {
      ...session,
    },
  ]

  console.log('new sessions', result)
  return result
}

function setActiveSession(
  sessions: StudySession[],
  sessionId: string,
): StudySession[] {
  const result = sessions.map(session => ({
    ...session,
    active: session.id === sessionId,
  }))

  return result
}

function updateSessionName(
  sessions: StudySession[],
  sessionId: string,
  sessionName: string,
): StudySession[] {
  const result = sessions.map(session => {
    if (session.id !== sessionId) {
      return session
    } else {
      return { ...session, name: sessionName }
    }
  })

  return result
}

function removeSession(
  sessions: StudySession[],
  sessionId: string,
): StudySession[] {
  return sessions.filter(session => session.id !== sessionId)
}

function updateAssessments(
  sessions: StudySession[],
  sessionId: string,
  assessments: Assessment[],
): StudySession[] {
  const result = sessions.map(session => {
    if (session.id !== sessionId) {
      return session
    } else {
      return { ...session, assessments: assessments }
    }
  })
  return result
}

function actionsReducer(
  sessions: StudySession[],
  action: SessionAction,
): StudySession[] {
  switch (action.type) {
    case Types.SetSessions: {
      return action.payload.sessions
    }

    case Types.AddSession: {
      return addSession(
        sessions,
        action.payload.name,
        action.payload.assessments,
        action.payload.active,
      )
    }
    case Types.SetActiveSession: {
      return setActiveSession(sessions, action.payload.sessionId)
    }

    case Types.UpdateSessionName: {
      return updateSessionName(
        sessions,
        action.payload.sessionId,
        action.payload.sessionName,
      )
    }

    case Types.RemoveSession: {
      return removeSession(sessions, action.payload.sessionId)
    }
    case Types.UpdateAssessments: {
      return updateAssessments(
        sessions,
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
