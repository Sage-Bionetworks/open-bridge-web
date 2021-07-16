import {Box, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {RouteComponentProps, useParams} from 'react-router-dom'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataDispatch,
  useStudyInfoDataState,
} from '../../helpers/StudyInfoContext'
import {setBodyClass} from '../../helpers/utility'
import StudyService from '../../services/study.service'
import {ThemeType} from '../../style/theme'
import {Schedule, StartEventId, StudySession} from '../../types/scheduling'
import {
  Assessment,
  BackgroundRecorders,
  StringDictionary,
  Study,
} from '../../types/types'
import {ErrorFallback, ErrorHandler} from '../widgets/ErrorHandler'
import {MTBHeadingH1} from '../widgets/Headings'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import EnrollmentTypeSelector from './enrollment-type-selector/EnrollmentTypeSelector'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import Preview from './preview/Preview'
import IntroInfo from './scheduler/IntroInfo'
import Scheduler from './scheduler/Scheduler'
import {StudySection} from './sections'
import SessionCreator from './session-creator/SessionCreator'
import StudyLeftNav from './StudyLeftNav'
import TopErrorBanner from '../widgets/TopErrorBanner'

const subtitles: StringDictionary<string> = {
  description: 'Description',
  'team-settings': 'Team Settings',
  scheduler: 'Schedule Sessions',
  'session-creator': 'Create Sessions',
  customize: 'Customize your App',
  'enrollment-type-selector': 'Participant Study Enrollment',
  'passive-features': 'App Background Recorders ',
  launch: 'Launch study requirements',
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
    overflow: 'hidden',

    //backgroundColor: theme.palette.background.default,
  },
  mainAreaNormalWithLeftNav: {
    width: `1200px`,
    [theme.breakpoints.down('lg')]: {
      width: `905px`,
    },

    [theme.breakpoints.down('md')]: {
      width: `610px`,
    },
  },

  mainAreaWideWithLeftNav: {
    width: `1600px`,
    [theme.breakpoints.down('lg')]: {
      width: `1100px`,
    },
    [theme.breakpoints.down('md')]: {
      width: `768px`,
    },
  },
  mainAreaNoLeftNav: {
    width: `1500px`,
    [theme.breakpoints.down('lg')]: {
      width: '1200px', //`${(280+32) * 4 + 16 * 4}px`,
    },
    [theme.breakpoints.down('md')]: {
      width: `910px`,
    },
  },
  mainAreaWideNoLeftNav: {
    width: `1700px`,
    [theme.breakpoints.down('lg')]: {
      width: '1200px', //`${(280+32) * 4 + 16 * 4}px`,
    },
    [theme.breakpoints.down('md')]: {
      width: `910px`,
    },
  },
  introInfoContainer: {
    textAlign: 'center',
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    paddingTop: theme.spacing(5),
  },
}))

type StudyBuilderOwnProps = {}

type StudyBuilderProps = StudyBuilderOwnProps & RouteComponentProps

export type SchedulerErrorType = {
  errors: any
  entity: any
}

const StudyBuilder: FunctionComponent<StudyBuilderProps> = ({
  ...otherProps
}) => {
  const classes = useStyles()
  let {id, section: _section} = useParams<{
    id: string
    section: StudySection
  }>()
  const [section, setSection] = React.useState(_section)
  const [error, setError] = React.useState<string[]>([])
  const handleError = useErrorHandler()
  const [schedulerErrors, setSchedulerErrors] = React.useState<
    SchedulerErrorType[]
  >([])
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const {token} = useUserSessionDataState()
  const builderInfo: StudyInfoData = useStudyInfoDataState()
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const [open, setOpen] = React.useState(true)
  const [displayBanner, setDisplayBanner] = React.useState(false)

  const setData = (builderInfo: StudyInfoData) => {
    studyDataUpdateFn({
      type: 'SET_ALL',
      payload: builderInfo,
    })
  }

  const allSessionsHaveAssessments = () => {
    const sessions = builderInfo.schedule?.sessions
    return (
      !_.isEmpty(sessions) &&
      !sessions!.find(session => _.isEmpty(session.assessments))
    )
  }

  //Sets up the data from the intro page
  const createScheduleAndNameStudy = async (
    studyId: string,
    studyName: string,
    duration: string,
    start: StartEventId
  ) => {
    const studySession = StudyService.createEmptyStudySession(start)
    let schedule: Schedule = {
      guid: '',
      name: studyId,
      duration,
      sessions: [studySession],
    }
    const newSchedule = await StudyService.createNewStudySchedule(
      schedule,
      token!
    )

    let updatedStudy = {
      ...builderInfo.study,
      scheduleGuid: newSchedule.guid,
      name: studyName,
    }
    const newVersion = await StudyService.updateStudy(updatedStudy, token!)
    updatedStudy.version = newVersion
    setData({
      schedule: newSchedule,
      study: updatedStudy,
    })
  }

  const saveStudy = async (
    study: Study = builderInfo.study,
    saveButtonPressed?: boolean
  ): Promise<Study | undefined> => {
    setHasObjectChanged(true)
    setSaveLoader(true)
    setDisplayBanner(false)
    try {
      const newVersion = await StudyService.updateStudy(study, token!)
      const updatedStudy = {
        ...study,
        version: newVersion,
      }
      setData({
        ...builderInfo,
        study: updatedStudy,
      })
      setError([])

      setHasObjectChanged(false)
      return updatedStudy
    } catch (e) {
      if (e.statusCode === 401) {
        handleError(e)
      }
      setError([e.message])
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } finally {
      setSaveLoader(false)
      if (saveButtonPressed) setDisplayBanner(true)
    }
  }

  const saveStudySchedule = async (
    updatedSchedule?: Schedule,
    saveButtonPressed?: boolean
  ): Promise<Schedule | undefined> => {
    setError([])
    setSchedulerErrors([])
    setDisplayBanner(false)
    try {
      setSaveLoader(true)
      const schedule = updatedSchedule || builderInfo.schedule
      if (!schedule || !token) {
        return undefined
      }

      const savedUpdatedSchedule = await StudyService.saveStudySchedule(
        schedule,
        token
      )
      //we have the issue that scheduler comes back from the server without assessment resources
      //so we need to copy the resources back to the new schedule object before updating.
      //the reason why we want the updated object is that sessions ids get assigned by the server.
      //potentially we might just want to do it in that case, but this seems to be performane

      const oldSessionAssessments = schedule.sessions.reduce(function (
        prev,
        curr
      ) {
        if (curr.assessments) {
          return [...prev, ...curr.assessments]
        } else {
          return prev
        }
      },
      [] as Assessment[])

      savedUpdatedSchedule.sessions.forEach(session => {
        session.assessments?.forEach(assessment => {
          assessment.resources = oldSessionAssessments.find(
            oa => oa.guid === assessment.guid
          )?.resources
        })
      })
      setData({
        ...builderInfo,
        schedule: savedUpdatedSchedule,
      })
      setHasObjectChanged(false)
      return savedUpdatedSchedule
    } catch (e) {
      if (e.statusCode === 401) {
        handleError(e)
      }
      console.log(e, 'error')
      const entity = e.entity
      const errors = e.errors
      // This can occur when a request fails due to reasons besides bad user input.
      if (!errors || !entity) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        setError(prev => [...prev, e.message])
        return undefined
      }
      const errorObject = {
        entity: entity,
        errors: errors,
      }
      setSchedulerErrors(prev => [...prev, errorObject])
      return undefined
    } finally {
      setSaveLoader(false)
      if (saveButtonPressed) setDisplayBanner(true)
    }
  }

  const changeSection = async (next: StudySection) => {
    if (section === next || !allSessionsHaveAssessments()) {
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
      case 'launch': {
        const missingIrbInfo =
          !builderInfo.study.irbDecisionType ||
          !builderInfo.study.irbDecisionOn ||
          !builderInfo.study.irbExpiresOn
        if (missingIrbInfo) {
          delete builderInfo.study.irbDecisionOn
          delete builderInfo.study.irbExpiresOn
          delete builderInfo.study.irbDecisionType
        }
        saveFn = saveStudy
        break
      }

      case 'customize': {
        saveFn = saveStudy
        break
      }

      default: {
        saveFn = saveStudy
      }
    }
    /*'description'
  | 'team-settings'
  | 'timeline-viewer'
  | 'passive-features'
  | 'customize'
  | 'irb'
  | 'preview'
  | 'alerts'
  | 'launch'*/
    let updatedObject: Study | Schedule | undefined
    if (saveFn && hasObjectChanged) {
      updatedObject = await saveFn()
    }
    if (updatedObject || !hasObjectChanged) {
      window.history.pushState(null, '', next)
      setBodyClass(next)
      setSection(next)
    }
  }

  const navButtons = (
    <NavButtons
      id={id}
      currentSection={section}
      onNavigate={(section: StudySection) => changeSection(section)}
      disabled={!allSessionsHaveAssessments()}></NavButtons>
  )
  if (builderInfo.study && !builderInfo.schedule) {
    return (
      <Box className={classes.introInfoContainer}>
        <IntroInfo
          onContinue={(
            studyName: string,
            duration: string,
            startEventId: StartEventId
          ) => {
            createScheduleAndNameStudy(
              builderInfo.study.identifier,
              studyName,
              duration,
              startEventId
            )
          }}></IntroInfo>
      </Box>
    )
  }

  const getClasses = () => {
    return clsx(classes.mainArea, {
      [classes.mainAreaNormalWithLeftNav]: open,
      [classes.mainAreaWideWithLeftNav]:
        open && ['customize', 'scheduler'].includes(section),
      [classes.mainAreaNoLeftNav]: !open,
      [classes.mainAreaWideNoLeftNav]:
        !open && ['customize', 'scheduler'].includes(section),
    })
  }

  const getBannerType = () => {
    const errors = section === 'scheduler' ? schedulerErrors : error
    return errors.length > 0 ? 'error' : 'success'
  }

  return (
    <>
      <Box display="flex" bgcolor="#f7f7f7">
        <TopErrorBanner
          onClose={() => setDisplayBanner(false)}
          isVisible={displayBanner}
          type={getBannerType()}></TopErrorBanner>
        <Box width={open ? 210 : 56} flexShrink={0}></Box>
        <Box className={getClasses()} pt={8} pl={2}>
          <MTBHeadingH1>{subtitles[section as string]}</MTBHeadingH1>
        </Box>
      </Box>
      <span
        style={{
          fontSize: '9px',
          position: 'absolute',
          right: '0',
        }}>
        {' '}
        {hasObjectChanged ? 'object changed' : 'no change'}
      </span>
      <Container
        maxWidth="xl"
        style={{
          height: '100vh',
          padding: '0',
        }}>
        <Box paddingTop={2} display="flex" position="relative">
          <StudyLeftNav
            open={open}
            onToggle={() => setOpen(prev => !prev)}
            currentSection={section}
            onNavigate={(section: StudySection) => {
              changeSection(section)
            }}
            id={id}
            disabled={!allSessionsHaveAssessments()}></StudyLeftNav>

          <Box className={classes.mainAreaWrapper}>
            <Box className={getClasses()}>
              <LoadingComponent
                reqStatusLoading={saveLoader}
                variant="small"
                loaderSize="2rem"
                style={{
                  width: '2rem',
                  position: 'absolute',
                  top: '30px',
                  left: '50%',
                }}></LoadingComponent>
              {!_.isEmpty(error) && (
                <Alert variant="outlined" color="error">
                  {Array.isArray(error) ? (
                    error.map(e => (
                      <div
                        style={{
                          textAlign: 'left',
                        }}>
                        {e}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: 'left',
                      }}>
                      {error}
                    </div>
                  )}
                </Alert>
              )}
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={ErrorHandler}>
                <LoadingComponent reqStatusLoading={!builderInfo}>
                  {builderInfo.schedule && builderInfo.study && (
                    <>
                      {section === 'scheduler' && (
                        <Scheduler
                          id={id}
                          token={token!}
                          schedule={builderInfo.schedule}
                          version={builderInfo.schedule?.version}
                          hasObjectChanged={hasObjectChanged}
                          saveLoader={saveLoader}
                          onSave={() => saveStudySchedule(undefined, true)}
                          onUpdate={(schedule: Schedule) => {
                            setHasObjectChanged(true)
                            setData({
                              ...builderInfo,
                              schedule: schedule,
                            })
                          }}
                          schedulerErrors={schedulerErrors}>
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
                            saveStudySchedule({
                              ...builderInfo.schedule!,
                              sessions: data,
                            })
                          }}>
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
                          }}>
                          {navButtons}
                        </EnrollmentTypeSelector>
                      )}
                      {section === 'customize' && (
                        <AppDesign
                          hasObjectChanged={hasObjectChanged}
                          saveLoader={saveLoader}
                          study={builderInfo.study}
                          onSave={() => {
                            saveStudy(builderInfo.study, true)
                          }}
                          onUpdate={(updatedStudy: Study) => {
                            setHasObjectChanged(true)
                            setData({
                              ...builderInfo,
                              study: updatedStudy,
                            })
                          }}
                          onError={(error: string) =>
                            setError(prev => [...prev, error])
                          }>
                          {navButtons}
                        </AppDesign>
                      )}
                      {section === 'preview' && (
                        <Preview
                          studyId={builderInfo.study.identifier}
                          token={token!}
                          scheduleSessions={
                            builderInfo.schedule.sessions
                          }></Preview>
                      )}
                      {section === 'launch' && (
                        <Launch
                          hasObjectChanged={hasObjectChanged}
                          saveLoader={saveLoader}
                          studyInfo={builderInfo}
                          onSave={() =>
                            saveStudy({
                              ...builderInfo.study,
                              phase: 'recruitment',
                            })
                          }
                          onUpdate={(study: Study) => {
                            setHasObjectChanged(true)
                            setData({
                              ...builderInfo,
                              study: study,
                            })
                          }}>
                          {navButtons}
                        </Launch>
                      )}
                      {section === 'passive-features' && (
                        <PassiveFeatures
                          hasObjectChanged={hasObjectChanged}
                          saveLoader={saveLoader}
                          features={
                            builderInfo.study.clientData.backgroundRecorders
                          }
                          onUpdate={(data: BackgroundRecorders) => {
                            setHasObjectChanged(true)
                            const updatedStudy = {
                              ...builderInfo.study,
                            }
                            updatedStudy.clientData.backgroundRecorders = data

                            saveStudy(updatedStudy)
                          }}>
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
      </Container>
    </>
  )
}

export default StudyBuilder
