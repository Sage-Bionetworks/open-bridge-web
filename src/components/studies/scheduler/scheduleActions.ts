import { getRandomId } from '../../../helpers/utility'
import { SessionSchedule, StudySession } from '../../../types/scheduling'
import { Assessment } from '../../../types/types'

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

export enum ActionTypes {
  /*SetSessions = 'SET_SESSIONS',

  AddSession = 'ADD_SESSION',
  RemoveSession = 'REMOVE_SESSION',
  SetActiveSession = 'SEAT_ACTIVE_SESSION',
  UpdateSessionName = 'UPDATE_SESSION_NAME',
  UpdateAssessments = 'UPDATE_ASSESSMENTS',*/
  UpdateSessionSchedule = 'UPDATE_SCHEDULE',
}
/*
export type Schedule = {
  name: string
  startEventId: string
  sessions: StudySession[]
}
*/
export type ActionPayload = {
  [ActionTypes.UpdateSessionSchedule]: {
    sessionId: string
    schedule: SessionSchedule
  }
}

export type SessionScheduleAction = ActionMap<ActionPayload>[keyof ActionMap<
  ActionPayload
>]


function addSession(
  sessions: StudySession[],
  name: string,
  assessments: Assessment[],
  studyId: string,
  isActive: boolean = false,
): StudySession[] {
  const session: StudySession = {
    id: getRandomId(),
    assessments,
    active: isActive,
    studyId,
    order: sessions.length,
    //duration: 0,
    name,
  }

  const result = [
    ...sessions.map((session, index) => ({
      ...session,
      active: false,
      order: index,
    })),
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

function updateSessionSchedule(
  sessions: StudySession[],
  sessionId: string,
  sessionSchedule: SessionSchedule,
): StudySession[] {
  const result = sessions.map(session => {
    if (session.id !== sessionId) {
      return session
    } else {
      return { ...session, sessionSchedule }
    }
  })
  return result
}

/*
function removeSession(
  sessions: StudySession[],
  sessionId: string,
): StudySession[] {
  return sessions.filter(session => session.id !== sessionId).map((s, index) =>({ ...s, order: index }))
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
*/
function actionsReducer(
  sessions: StudySession[],
  action: SessionScheduleAction,
): StudySession[] {
  switch (action.type) {
    /*case Types.UpdateSessionSchedule: {
      return action.payload.sessions
    }

   case Types.AddSession: {
      return addSession(
        sessions,

        action.payload.name,
        action.payload.assessments,
        action.payload.studyId,
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
    }*/
    case ActionTypes.UpdateSessionSchedule: {
      return updateSessionSchedule(
        sessions,
        action.payload.sessionId,
        action.payload.schedule,
      )
    }

    default: {
      throw new Error(`Unhandled action type`)
    }
  }
}

export default actionsReducer
