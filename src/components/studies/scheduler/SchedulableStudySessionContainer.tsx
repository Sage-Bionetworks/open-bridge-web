import React, { FunctionComponent, useRef } from 'react'

import { Assessment, StudySession } from '../../../types/types'

import clsx from 'clsx'
import { makeStyles, Box, Button, Grid } from '@material-ui/core'

import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback, ErrorHandler } from '../../widgets/ErrorHandler'
import AssessmentWindow from './AssessmentWindow'
import RepeatFrequency from './RepeatFrequency'
import StartDate from './StartDate'
import EndDate from './EndDate'
import AssessmentList from './AssessmentList'
import {
  StartDateType,
  ReoccuranceType,
  AssessmentWindowType,
  EndDateType,
  WeekdaysEnum,
} from '../../../types/scheduling'
import { ThemeType } from '../../../style/theme'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',

    '&.active': {
      border: theme.activeBorder,
    },
  },

  formSection: {
    backgroundColor: '#acacac',
    padding: '20px',
    margin: '5px 0',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

type SessionSchedule = {
  startDate: StartDateType
  reoccurance: ReoccuranceType
  windows: AssessmentWindowType[]
  endDate: EndDateType
  isGroupAssessments?: boolean
  order: 'SEQUENTIAL' | 'RANDOM'
}

type SchedulableSingleSessionContainerProps = {
  studySession: StudySession
  onSetActiveSession: Function
}

const SchedulableSingleSessionContainer: FunctionComponent<SchedulableSingleSessionContainerProps> = ({
  studySession,

  onSetActiveSession,
}: SchedulableSingleSessionContainerProps) => {
  const classes = useStyles()
  // The first commit of Material-UI

  const defaultSchedule: SessionSchedule = {
    startDate: {
      type: 'OPEN_APP',
    },
    reoccurance: { unit: 'DAILY', frequency: 1, days: [WeekdaysEnum['S']] },
    windows: [],
    endDate: {
      type: 'END_STUDY',
    },
    isGroupAssessments: true,
    order: 'SEQUENTIAL',
  }
  const [schedulableSession, setSchedulableSession] = React.useState<
    SessionSchedule
  >(defaultSchedule)

  console.log('rerenderSSession', schedulableSession)

  const addNewWindow = () => {
    const newState = { ...schedulableSession }
    newState.windows.push({ start: 5, end: 17 })
    setSchedulableSession(newState)
  }

  const deleteWindow = (index: number) => {
    const windows = [...schedulableSession.windows]
    windows.splice(index, 1)
    setSchedulableSession(oldSession => {
      return {
        ...oldSession,
        windows: [...windows],
      }
    })
  }

  const updateWindow = (window: AssessmentWindowType, index: number) => {
    setSchedulableSession(oldSession => {
      return {
        ...oldSession,
        windows: oldSession.windows.map((item, i) =>
          i === index ? window : item,
        ),
      }
    })
  }

  return (
    <Box
      className={clsx(classes.root, studySession?.active && 'active')}
      onClick={() => onSetActiveSession(studySession.id)}
    >
      <form noValidate autoComplete="off">
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
          <Grid container spacing={2} item xs={12}>
            <Grid item xs={3}>
              <AssessmentList
                studySession={studySession}
                onSetRandomized={(isRandomized: boolean) => {
                  console.log(isRandomized)
                  setSchedulableSession(prev => ({
                    ...prev,
                    order: isRandomized ? 'RANDOM' : 'SEQUENTIAL',
                  }))
                }}
                onChangeGrouping={(isGroupAssessments: boolean) => {
                  setSchedulableSession(prev => ({
                    ...prev,
                    isGroupAssessments,
                  }))
                }}
                isGroupAssessments={
                  schedulableSession.isGroupAssessments || false
                }
                assessmentOrder={schedulableSession.order}
              />
            </Grid>

            <Grid item xs={9}>
              <Box className={classes.formSection}>
                <StartDate
                  startDate={schedulableSession.startDate}
                  onChange={(startDate: StartDateType) =>
                    setSchedulableSession(prev => ({ ...prev, startDate }))
                  }
                ></StartDate>
              </Box>
              <Box className={classes.formSection}>
                <EndDate
                  endDate={schedulableSession.endDate}
                  onChange={(endDate: EndDateType) =>
                    setSchedulableSession(prev => ({ ...prev, endDate }))
                  }
                ></EndDate>
              </Box>
              <Box className={classes.formSection}>
                <RepeatFrequency
                  onChange={(repeatFrequency: ReoccuranceType) => {
                    setSchedulableSession(prev => ({
                      ...prev,
                      reoccurance: repeatFrequency,
                    }))
                  }}
                  repeatFrequency={schedulableSession.reoccurance}
                ></RepeatFrequency>
              </Box>

              <Box className={classes.formSection}>
                Assessment Window:
                {schedulableSession.windows.map((window, index) => (
                  <AssessmentWindow
                    key={`${index}${window.start}${window.end}`}
                    onDelete={() => {
                      console.log('deleting1', index)
                      deleteWindow(index)
                    }}
                    onChange={(window: AssessmentWindowType) =>
                      updateWindow(window, index)
                    }
                    window={window}
                  ></AssessmentWindow>
                ))}
                <Button onClick={addNewWindow}>Add new window</Button>
              </Box>
            </Grid>
          </Grid>
        </ErrorBoundary>
      </form>
    </Box>
  )
}

export default SchedulableSingleSessionContainer
