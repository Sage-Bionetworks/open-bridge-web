import {SessionSchedule, StudySession} from '../../../types/scheduling'

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

export enum ActionTypes {
  UpdateSessionSchedule = 'UPDATE_SCHEDULE',
}

export type ActionPayload = {
  [ActionTypes.UpdateSessionSchedule]: {
    sessionId: string
    schedule: SessionSchedule
    shouldInvalidateBurst?: boolean
  }
}

export type SessionScheduleAction =
  ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>]

function updateSessionSchedule(
  sessions: StudySession[],
  sessionId: string,
  updatedSession: SessionSchedule,
  shouldInvalidateBurst?: boolean
): StudySession[] {
  if (shouldInvalidateBurst) {
    updatedSession.studyBurstIds = []
  }
  const result = sessions.map(session => {
    if (session.guid !== sessionId) {
      return session
    } else {
      return {...session, ...updatedSession}
    }
  })
  return result
}

function actionsReducer(
  sessions: StudySession[],
  action: SessionScheduleAction
): StudySession[] {
  switch (action.type) {
    case ActionTypes.UpdateSessionSchedule: {
      return updateSessionSchedule(
        sessions,
        action.payload.sessionId,
        action.payload.schedule,
        action.payload.shouldInvalidateBurst
      )
    }

    default: {
      throw new Error(`Unhandled action type`)
    }
  }
}

export default actionsReducer
