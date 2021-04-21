import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataDispatch,
  useStudyInfoDataState
} from '../../helpers/StudyInfoContext'
import { setBodyClass } from '../../helpers/utility'
import AssessmentService from '../../services/assessment.service'
import StudyService from '../../services/study.service'
import { ThemeType } from '../../style/theme'
import { Schedule, StartEventId, StudySession } from '../../types/scheduling'
import {
  BackgroundRecorders,
  StringDictionary,
  Study,
  StudyAppDesign
} from '../../types/types'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import { MTBHeadingH1 } from '../widgets/Headings'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import EnrollmentTypeSelector from './enrollment-type-selector/EnrollmentTypeSelector'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import IntroInfo from './scheduler/IntroInfo'
import Scheduler from './scheduler/Scheduler'
import { StudySection } from './sections'
import SessionCreator from './session-creator/SessionCreator'
import StudyLeftNav from './StudyLeftNav'

const subtitles: StringDictionary<string> = {
  description: 'Description',
  'team-settings': 'Team Settings',

  scheduler: 'Schedule Sessions',
  'session-creator': 'Create Sessions',
  'enrollment-type-selector ': 'Participant Study Enrollment',
  'passive-features': 'App Background Recorders ',
}

const useStyles = makeStyles((theme: ThemeType) => ({
  mainAreaWrapper: {
    textAlign: 'center',
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default
  },
  mainArea: {
    margin: '0 auto',
    minHeight: '100px',
    //backgroundColor: theme.palette.background.default,
  },
  mainAreaNormal: {
    width: `${280 * 3 + 16 * 4}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 2 + 16 * 2}px`,
    },
  },

  mainAreaWider: {
    width: `${280 * 4 + 16 * 3}px`,
    [theme.breakpoints.down('md')]: {
      width: `768px`,
    },
  },
  mainAreaWide: {
    width: `${280 * 4 + 16 * 4}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 3 + 16 * 3}px`,
    },
  },
  introInfoContainer: {
    textAlign: 'center',
    backgroundColor: '#FAFAFA',
    height: '100vh',
    paddingTop: theme.spacing(18.5),
  },
}))

type StudyBuilderOwnProps = {}

type StudyBuilderProps = StudyBuilderOwnProps & RouteComponentProps

const StudyBuilder: FunctionComponent<StudyBuilderProps> = ({
  ...otherProps
}) => {
  const classes = useStyles()
  let { id, section: _section } = useParams<{
    id: string
    section: StudySection
  }>()
  const [section, setSection] = React.useState(_section)
  const [error, setError] = React.useState('')
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const { token } = useUserSessionDataState()
  const builderInfo: StudyInfoData = useStudyInfoDataState()
  const studyDataUpdateFn = useStudyInfoDataDispatch()

  const [open, setOpen] = React.useState(true)

  const setData = (builderInfo: StudyInfoData) => {
    studyDataUpdateFn({ type: 'SET_ALL', payload: builderInfo })

    //updating on the intro screen
  }

  const createSchedule = async (
    studyId: string,
    duration: string,
    start: StartEventId,
  ) => {
    const defaultAssessment = await (
      await AssessmentService.getAssessmentsWithResources()
    ).assessments[0]

    const studySession = StudyService.createEmptyStudySession(start)
    studySession.assessments = [defaultAssessment]

    let schedule: Schedule = {
      guid: '',
      name: studyId,
      duration,
      sessions: [studySession],
    }
    const newSchedule = await StudyService.createNewStudySchedule(
      schedule,
      token!,
    )

    let updatedStudy = {
      ...builderInfo.study,
      scheduleGuid: newSchedule.guid,
    }
    const result = await saveStudy(updatedStudy)
    setData({ schedule: newSchedule, study: updatedStudy })
  }

  const saveStudy = async (study: Study) => {
    setHasObjectChanged(true)
    setSaveLoader(true)

    /* saveStudy(updatedStudy).then(
      () => {
        setData({
          ...builderInfo,
          study: updatedStudy,
        })
        setHasObjectChanged(false)
      },
      e => {
        setError(e.message)
        setHasObjectChanged(false)
      },
    )*/
    try {
      const newVersion = await StudyService.updateStudy(study, token!)
      const updatedStudy = { ...study, version: newVersion }
      setData({
        ...builderInfo,
        study: updatedStudy,
      })

      setHasObjectChanged(false)
      return updatedStudy
    } catch (e) {
      setError(e.message)
    } finally {
      setSaveLoader(false)
    }
  }

  const saveStudySchedule = async (updatedSchedule?: Schedule) => {
    setError('')
    try {
      setSaveLoader(true)
      const schedule = updatedSchedule || builderInfo.schedule
      if (!schedule || !token) {
        return
      }
      const sched = await StudyService.saveStudySchedule(schedule, token)
      setData({
        ...builderInfo,
        schedule: { ...schedule, version: sched.version },
      })

      setHasObjectChanged(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaveLoader(false)
    }
  }

  const changeSection = async (next: StudySection) => {
    if (section === next) {
      return
    }

    let saveFn: Function | undefined = undefined
    //where we are currently
    switch (section) {
      case 'scheduler': {
        saveFn = saveStudySchedule
        break
      }
      case 'session-creator': {
        saveFn = saveStudySchedule
        break
      }
      /*case 'enrollment-type-selector': {
        saveFn = saveStudy
        break
      }*/

      default: {
      }
    }
    /*'description'
  | 'team-settings'
  | 'timeline-viewer'
  | 'passive-features'
  | 'branding'
  | 'irb'
  | 'preview'
  | 'alerts'
  | 'launch'*/
    if (saveFn && hasObjectChanged) {
      await saveFn()
    }
    window.history.pushState(null, '', next)
    setBodyClass(next)
    setSection(next)
  }

  const navButtons = (
    <NavButtons
      id={id}
      currentSection={section}
      onNavigate={(section: StudySection) => changeSection(section)}
    ></NavButtons>
  )
  if (builderInfo.study && !builderInfo.schedule) {
    return (
      <Box className={classes.introInfoContainer}>
        {' '}
        <IntroInfo
          onContinue={(duration: string, startEventId: StartEventId) =>
            createSchedule(builderInfo.study.identifier, duration, startEventId)
          }
        ></IntroInfo>
      </Box>
    )
  }
  return (
    <>
      <Box bgcolor="white" pt={9} pb={2} pl={open ? 29 : 15}>
        <MTBHeadingH1>{subtitles[section as string]}</MTBHeadingH1>
      </Box>
      <span style={{ fontSize: '9px', position: 'absolute', right: '0' }}>
        {' '}
        {hasObjectChanged ? 'object changed' : 'no change'}
      </span>
      <Box paddingTop={2} display="flex" position="relative">
        <StudyLeftNav
          open={open}
          onToggle={() => setOpen(prev => !prev)}
          currentSection={section}
          onNavigate={(section: StudySection) => {
            changeSection(section)
          }}
          id={id}
        ></StudyLeftNav>

        <Box className={classes.mainAreaWrapper}>
          <Box
            className={clsx(classes.mainArea, {
              [classes.mainAreaNormal]: open,
              [classes.mainAreaWider]:
                open && ['branding', 'scheduler'].includes(section),
              [classes.mainAreaWide]: !open,
            })}
          >
            <LoadingComponent
              reqStatusLoading={saveLoader}
              variant="small"
              loaderSize="2rem"
              style={{
                width: '2rem',
                position: 'absolute',
                top: '30px',
                left: '50%',
              }}
            ></LoadingComponent>
            {error && (
              <Alert variant="outlined" color="error">
                {error}
              </Alert>
            )}

            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}
            >
              <LoadingComponent reqStatusLoading={!builderInfo}>
                {builderInfo.schedule && builderInfo.study && (
                  <>
                    {section === 'scheduler' && (
                      <Scheduler
                        id={id}
                        token={token!}
                        schedule={builderInfo.schedule}
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        onSave={() => saveStudySchedule()}
                        onUpdate={(schedule: Schedule) => {
                          setHasObjectChanged(true)
                          setData({
                            ...builderInfo,
                            schedule: schedule,
                          })
                        }}
                      >
                        {navButtons}
                      </Scheduler>
                    )}

                    {section === 'session-creator' && (
                      <SessionCreator
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        id={id}
                        onSave={() => saveStudySchedule()}
                        sessions={builderInfo.schedule?.sessions || []}
                        onUpdate={(data: StudySession[]) => {
                          setHasObjectChanged(true)
                          setData({
                            ...builderInfo,
                            schedule: {
                              ...builderInfo.schedule!,
                              sessions: data,
                            },
                          })
                          saveStudySchedule({
                            ...builderInfo.schedule!,
                            sessions: data,
                          })
                        }}
                      >
                        {navButtons}
                      </SessionCreator>
                    )}

                    {section === 'enrollment-type-selector' && (
                      <EnrollmentTypeSelector
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        study={builderInfo.study}
                        onUpdate={(study: Study) => {
                          setHasObjectChanged(true)
                          saveStudy(study)
                        }}
                      >
                        {navButtons}
                      </EnrollmentTypeSelector>
                    )}

                    {section === 'branding' && (
                      <AppDesign
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        id={id}
                        currentAppDesign={
                          builderInfo.study.clientData?.appDesign ||
                          ({} as StudyAppDesign)
                        }
                        onSave={() => {
                          saveStudy(builderInfo.study)
                        }}
                        onUpdate={(data: StudyAppDesign) => {
                          setHasObjectChanged(true)
                          const updatedStudy = { ...builderInfo.study }
                          updatedStudy.clientData = {
                            ...(updatedStudy.clientData || {}),
                            appDesign: data,
                          }

                          setData({
                            ...builderInfo,
                            study: updatedStudy,
                          })
                        }}
                      >
                        {navButtons}
                      </AppDesign>
                    )}
                    {section === 'launch' && (
                      <Launch
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        id={id}
                        onUpdate={(_section: StudySection, data: any) => {
                          console.log(_section)
                          // moveToNextSection(_section)
                        }}
                      >
                        {navButtons}
                      </Launch>
                    )}
                    {section === 'passive-features' && (
                      <PassiveFeatures
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        study={builderInfo.study}
                        onUpdate={(data: BackgroundRecorders) => {
                          setHasObjectChanged(true)
                          const updatedStudy = { ...builderInfo.study }
                          updatedStudy.clientData.backgroundRecorders = data
                          saveStudy(updatedStudy)
                        }}
                      >
                        {navButtons}
                      </PassiveFeatures>
                    )}
                  </>
                )}
              </LoadingComponent>
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default StudyBuilder
