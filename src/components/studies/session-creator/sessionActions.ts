import {SessionSymbols} from '@components/widgets/SessionIcon'
import {JOINED_EVENT_ID} from '@services/event.service'
import _ from 'lodash'
import ScheduleService from '../../../services/schedule.service'
import {StudySession} from '../../../types/scheduling'
import {Assessment} from '../../../types/types'

type ActionMap<M extends {[index: string]: any}> = {
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
  }
  [Types.RemoveSession]: {
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

export type SessionAction = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>]

function addSession(
  sessions: StudySession[],
  name: string,

  assessments: Assessment[]
): StudySession[] {
  const startEventId = sessions.length ? _.first(sessions[0].startEventIds) : JOINED_EVENT_ID

  var symbolKeys = Array.from(SessionSymbols.keys())
  const usedSymbols = sessions.map(s => s.symbol).filter(s => !!s)
  let firstUnusedSymbolKey = symbolKeys.find(key => !usedSymbols.includes(key))
  if (!firstUnusedSymbolKey) {
    firstUnusedSymbolKey = _.last(symbolKeys)
  }

  const session = ScheduleService.createEmptyScheduleSession(
    startEventId || JOINED_EVENT_ID,
    firstUnusedSymbolKey!,
    name
  )

  session.assessments = assessments

  const result = [
    ...sessions,
    {
      ...session,
    },
  ]

  console.log('new sessions', result)
  return result
}

function updateSessionName(sessions: StudySession[], sessionId: string, sessionName: string): StudySession[] {
  const result = sessions.map(session => {
    if (session.guid !== sessionId) {
      return session
    } else {
      return {...session, name: sessionName}
    }
  })

  return result
}

function removeSession(sessions: StudySession[], sessionId: string): StudySession[] {
  return sessions.filter(session => session.guid !== sessionId).map((s, index) => ({...s, order: index}))
}

function updateAssessments(sessions: StudySession[], sessionId: string, assessments: Assessment[]): StudySession[] {
  const result = sessions.map(session => {
    if (session.guid !== sessionId) {
      return session
    } else {
      return {...session, assessments: assessments}
    }
  })
  return result
}

function actionsReducer(sessions: StudySession[], action: SessionAction): StudySession[] {
  switch (action.type) {
    case Types.SetSessions: {
      return action.payload.sessions
    }

    case Types.AddSession: {
      return addSession(sessions, action.payload.name, action.payload.assessments)
    }

    case Types.UpdateSessionName: {
      return updateSessionName(sessions, action.payload.sessionId, action.payload.sessionName)
    }

    case Types.RemoveSession: {
      return removeSession(sessions, action.payload.sessionId)
    }
    case Types.UpdateAssessments: {
      return updateAssessments(sessions, action.payload.sessionId, action.payload.assessments)
    }

    default: {
      throw new Error(`Unhandled action type`)
    }
  }
}

export default actionsReducer
