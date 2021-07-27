import {Box, createStyles, makeStyles, Theme} from '@material-ui/core'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {poppinsFont} from '../../../style/theme'
import {Schedule, StartEventId, StudySession} from '../../../types/scheduling'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import actionsReducer, {SessionScheduleAction} from './scheduleActions'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
  })
)

type SessionStartPageProps = {
  schedule: Schedule
  onUpdate: Function
  onSave: Function
  // hasObjectChanged: boolean
  //saveLoader: boolean
}

const SessionStartPage: FunctionComponent<SessionStartPageProps> = ({
  //hasObjectChanged,
  //saveLoader,
  onUpdate,
  schedule,
  onSave,
}: SessionStartPageProps) => {
  const classes = useStyles()

  const saveSession = async (sessionId: string) => {
    onSave()
  }

  //setting new state
  const updateData = (schedule: Schedule) => {
    // setSchedule(schedule)
    onUpdate(schedule)
  }

  //updating the schedule part
  const updateSessionsWithStartEventId = (
    sessions: StudySession[],
    startEventId: StartEventId
  ) => {
    return sessions.map(s => ({...s, startEventId}))
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions, action)
    const newSchedule = {...schedule, sessions}
    updateData(newSchedule)
  }

  if (_.isEmpty(schedule.sessions)) {
    return (
      <Box textAlign="center" mx="auto">
        <ErrorDisplay>
          You need to create sessions before creating the schedule
        </ErrorDisplay>
      </Box>
    )
  }

  return (
    <Box>
      <Box textAlign="left" key="content" bgcolor="#fff">
        Session Start Page
      </Box>
    </Box>
  )
}

export default SessionStartPage
