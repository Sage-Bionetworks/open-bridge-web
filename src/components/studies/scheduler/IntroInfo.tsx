import Loader from '@components/widgets/Loader'
import {SessionSymbols} from '@components/widgets/SessionIcon'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Alert, Box, Button, Container, Divider, FormControlLabel, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import ScheduleService from '@services/schedule.service'
import {useSchedule, useUpdateSchedule} from '@services/scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '@services/studyHooks'
import {latoFont, theme} from '@style/theme'
import constants from '@typedefs/constants'
import {DWsEnum, Schedule} from '@typedefs/scheduling'
import {Study} from '@typedefs/types'
import React from 'react'
import {useHistory} from 'react-router-dom'
import {BuilderWrapper} from '../StudyBuilder'
import Duration from './Duration'
import ReadOnlyIntroInfo from './read-only-pages/ReadOnlyIntroInfo'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      marginLeft: 0,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'left',
      alignSelf: 'start',
      alignItems: 'flex-start',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',

      minWidth: '300px',
    },
    formControl: {
      fontSize: '18px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },

    divider: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    headerText: {
      fontSize: '18px',

      lineHeight: '27px',
    },
    description: {
      fontFamily: 'Lato',
      fontStyle: 'italic',
      fontSize: '15px',
      fontWeight: 'lighter',
      lineHeight: '18px',
    },
    middleContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    weekInformation: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '12px',
      lineHeight: '20px',
      marginLeft: theme.spacing(2.25),

      marginTop: theme.spacing(19),
      textAlign: 'left',
      listStyle: 'none',
    },
    hint: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'block',
    },
    continueButton: {
      display: 'flex',
      height: '45px',
      marginTop: theme.spacing(8),
      alignSelf: 'flex-start',
    },
  })
)

export interface IntroInfoProps {
  studyName: string
  id: string
  isReadOnly?: boolean
  children: React.ReactNode
  onShowFeedback: Function
}

const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({id, onShowFeedback, isReadOnly}) => {
  const classes = useStyles()

  const [studyName, setStudyName] = React.useState('')
  const [duration, setDuration] = React.useState<any>('')
  const {data: study, error: studyError, isLoading: isLoadingStudy} = useStudy(id)
  const {data: schedule, error: scheduleError, isLoading: isLoadingSchedule} = useSchedule(id)
  const {mutate: mutateSchedule} = useUpdateSchedule()
  const history = useHistory()

  const {mutate: mutateStudy} = useUpdateStudyDetail()

  React.useEffect(() => {
    if (study && study.name !== constants.constants.NEW_STUDY_NAME) {
      setStudyName(study.name)
    }
  }, [study])

  React.useEffect(() => {
    if (schedule && !scheduleError) {
      setDuration(schedule.duration)
    }
  }, [schedule, scheduleError])

  const createScheduleAndNameStudy = async (id: string, studyName: string, duration: string, start: string) => {
    const shouldUpdateSchedule = !schedule || schedule.duration !== duration
    const shouldUpdateStudy = study && study.name !== studyName
    var hasError = false

    //update schedule if needed
    if (shouldUpdateSchedule) {
      let updatedSchedule: Schedule
      let action: 'UPDATE' | 'CREATE' = 'CREATE'
      if (!schedule) {
        //creating new schedule
        const studySession = ScheduleService.createEmptyScheduleSession(start, SessionSymbols.keys().next().value)
        updatedSchedule = {
          guid: '',
          name: id,
          duration,
          sessions: [studySession],
        }
      } else {
        //updating existing schedule
        action = 'UPDATE'
        updatedSchedule = {
          ...schedule,
          duration,
        }
      }

      mutateSchedule(
        {
          studyId: id,
          schedule: updatedSchedule,
          action,
        },
        {
          onError: (e: any) => {
            onShowFeedback(e)
            hasError = true
          },
          onSuccess: () => console.log(`schedule ${action}d`),
        }
      )
    }

    if (shouldUpdateStudy) {
      const updatedStudy: Study = {
        ...study!,
        name: studyName,
      }

      mutateStudy(
        {study: updatedStudy},
        {
          onError: (e: any) => {
            onShowFeedback(e)
            hasError = true
          },
          onSuccess: () => console.log(`study updated`),
        }
      )
    }
    if (!hasError) {
      history.push(`/studies/builder/${id}/session-creator`)
    }
  }

  return isReadOnly ? (
    <Loader reqStatusLoading={isLoadingSchedule || isLoadingSchedule}>
      {study && <ReadOnlyIntroInfo name={study.name} duration={schedule?.duration} />}
    </Loader>
  ) : (
    <>
      <BuilderWrapper sectionName="Study Details">
        <Container maxWidth="md" className={classes.container}>
          <div>
            {studyError && <Alert color="error">{studyError.message}</Alert>}
            <FormControlLabel
              style={{marginBottom: '35px', marginLeft: 0}}
              classes={{labelPlacementStart: classes.labelDuration}}
              label={
                <Box width="210px" marginRight="40px">
                  <strong className={classes.headerText}>Study Name</strong>
                  <br /> <br />
                  <div className={classes.description}>
                    This name will be displayed to your participants in the app.
                  </div>{' '}
                </Box>
              }
              className={classes.formControl}
              labelPlacement="start"
              control={<SimpleTextInput fullWidth value={studyName} onChange={e => setStudyName(e.target.value)} />}
            />
            <Divider className={classes.divider}></Divider>
            <Box className={classes.middleContainer}>
              <FormControlLabel
                classes={{
                  labelPlacementStart: classes.labelDuration,
                }}
                label={
                  <Box width="210px" marginRight="40px">
                    <strong className={classes.headerText}>How long is your study?</strong>
                    <br /> <br />
                    <div className={classes.description}>
                      This is the duration that a participant is involved in the study.
                    </div>{' '}
                  </Box>
                }
                className={classes.formControl}
                labelPlacement="start"
                control={
                  <Box>
                    <Duration
                      onChange={e => setDuration(e.target.value)}
                      durationString={duration || ''}
                      unitLabel="study duration unit"
                      inputWidth={8}
                      numberLabel="study duration number"
                      maxDurationDays={1825}
                      unitData={DWsEnum}
                      isIntro={true}></Duration>
                    <span className={classes.hint}>
                      <strong>The study duration must be shorter than 5 years.</strong>
                    </span>
                  </Box>
                }
              />
            </Box>
          </div>

          <ul className={classes.weekInformation}>
            <li>Example Conversions</li>
            <li>1 year = 52 weeks</li>
            <li>2 year = 104 weeks</li>
            <li>3 year = 156 weeks</li>
            <li>4 year = 208 weeks</li>
            <li>5 year = 260 weeks</li>
          </ul>
        </Container>
      </BuilderWrapper>
      <Button
        // className={classes.continueButton}
        variant="contained"
        sx={{marginTop: theme.spacing(2)}}
        color="primary"
        key="saveButton"
        onClick={e =>
          createScheduleAndNameStudy(
            id,

            studyName,
            duration,
            'timeline_retrieved'
          )
        }
        disabled={!(duration && studyName)}>
        Continue
      </Button>
    </>
  )
}

export default IntroInfo
