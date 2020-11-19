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
  StartDate as StartDateType,
  Reoccurance as ReoccuranceType,
  AssessmentWindow as AssessmentWindowType,
  EndDate as EndDateType,
  HSsEnum,
} from '../../../types/scheduling'
import { ThemeType } from '../../../style/theme'
import ObjectDebug from '../../widgets/ObjectDebug'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    // padding: '12px',
    // border: '1px solid #C4C4C4',
    /* '&.active': {
      border: theme.activeBorder,
    },*/
  },

  formSection: {
    // backgroundColor: '#acacac',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
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
 
  const defaultSchedule: SessionSchedule = {
    startDate: {
      type: 'DAY1',
    },
    reoccurance: { unit: 'DAY', frequency: 1 },
    windows: [],
    endDate: {
      type: 'END_STUDY',
    },
    isGroupAssessments: false,
    order: 'SEQUENTIAL',
  }
  const [schedulableSession, setSchedulableSession] = React.useState<
    SessionSchedule
  >(defaultSchedule)



  const addNewWindow = () => {
    const newState = { ...schedulableSession }
    newState.windows.push({
      startHour: 5,
      end: { endQuantity: 17, endUnit: 'DAY' },
    })
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
      console.log('upladingWindowTo: ', window)
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
      <ObjectDebug label="schedule" data={schedulableSession}></ObjectDebug>
      <form noValidate autoComplete="off">
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
          <Box display="flex">
            <Box width="324px" flexGrow="0" bgcolor="#BCD5E4" padding="8px">
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
            </Box>

            <Box bgcolor="#F8F8F8" flexGrow="1">
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
                <SchedulingFormSection label={'Session Window:'}>
                  <Box>
                    {schedulableSession.windows.map((window, index) => (
                      <AssessmentWindow
                        key={`${index}${window.startHour}${window.end}`}
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
                    <Button onClick={addNewWindow} variant="contained">
                      +Add new window
                    </Button>
                  </Box>
                </SchedulingFormSection>
              </Box>
            </Box>
          </Box>
        </ErrorBoundary>
      </form>
    </Box>
  )
}

export default SchedulableSingleSessionContainer
