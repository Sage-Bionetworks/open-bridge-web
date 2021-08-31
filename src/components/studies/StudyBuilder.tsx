import {useSchedule, useUpdateSchedule} from '@components/studies/scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '@components/studies/studyHooks'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'
import ScheduleService from '@services/schedule.service'
import StudyService from '@services/study.service'
import {ThemeType} from '@style/theme'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {
  Route,
  RouteComponentProps,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import {Schedule, SchedulingEvent, StartEventId} from '../../types/scheduling'
import {
  Assessment,
  BackgroundRecorders,
  StringDictionary,
  Study,
  StudyPhase,
} from '../../types/types'
import {ErrorFallback, ErrorHandler} from '../widgets/ErrorHandler'
import {MTBHeadingH1} from '../widgets/Headings'
import LoadingComponent from '../widgets/Loader'
import TopErrorBanner from '../widgets/TopErrorBanner'
import AppDesign from './app-design/AppDesign'
import BannerInfo from './BannerInfo'
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
  negativeTop: {
    marginTop: '-38px',
  },
  studyComponentContainer: {
    minHeight: '100vh',
    padding: '0',
    height: '100%',
  },
}))

type StudyBuilderOwnProps = {}

type StudyBuilderProps = StudyBuilderOwnProps & RouteComponentProps

export type SchedulerErrorType = {
  errors: any
  entity: any
}

const StudyBuilder: FunctionComponent<StudyBuilderProps & RouteComponentProps> =
  ({...otherProps}) => {
    const classes = useStyles()
    const {url, path} = useRouteMatch()
    console.log(`${url}`)
    console.log(`${path}`)
    let {id, section} = useParams<{
      id: string
      section: StudySection
    }>()

    const {
      data: scheduleSource,
      error: scheduleError,
      isLoading: isScheduleLoading,
    } = useSchedule(id)
    const {data: studySource, error: studyError} = useStudy(id)
    const [study, setStudy] = React.useState<Study | undefined>()
    const [schedule, setSchedule] = React.useState<Schedule | undefined>()
    const {
      isSuccess: scheduleUpdateSuccess,
      isError: scheduleUpdateError,
      mutateAsync: mutateSchedule,
      data,
    } = useUpdateSchedule()

    const {
      isSuccess: studyUpdateSuccess,
      isError: studyUpdateError,
      mutateAsync: mutateStudy,
    } = useUpdateStudyDetail()
    const [error, setError] = React.useState<string[]>([])
    const handleError = useErrorHandler()
    const [schedulerErrors, setSchedulerErrors] = React.useState<
      SchedulerErrorType[]
    >([])
    const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
    const [saveLoader, setSaveLoader] = React.useState(false)
    const {token} = useUserSessionDataState()

    const [open, setOpen] = React.useState(true)
    const [displayBanner, setDisplayBanner] = React.useState(false)
    const [bannerType, setBannerType] = React.useState<{
      bgColor: string
      displayText: string[]
      icon: string[]
      textColor: string
      type: string
    }>()

    React.useEffect(() => {
      console.log('source change')
      if (!study) {
        setStudy(studySource)
      }
    }, [studySource])

    React.useEffect(() => {
      if (!schedule) {
        setSchedule(scheduleSource)
      }
    }, [scheduleSource])

    React.useEffect(() => {
      if (study) {
        const banner = getBannerType(study.phase, section)
        const bannerType = BannerInfo.bannerMap.get(banner)
        setBannerType(bannerType)
        if (banner !== 'success' && banner !== 'error') {
          setDisplayBanner(true)
        }
      }
    }, [study?.phase, schedulerErrors, error])

    if (!study) {
      return <>no study</>
    }

    // console.log('studyId', id)

    if (studyError || scheduleError) {
      //alert(studyError)
      //@ts-ignore
      if (studyError || (scheduleError && scheduleError.statusCode !== 404)) {
        handleError(studyError)
      }
    }

    const getBannerType = (phase: StudyPhase, currentSection: StudySection) => {
      switch (phase) {
        case 'in_flight':
          return 'live'
        case 'withdrawn':
          return 'withdrawn'
        case 'analysis':
        case 'completed':
          return 'completed'
        default:
          const errors =
            currentSection === 'scheduler' ? schedulerErrors : error
          return errors.length > 0 ? 'error' : 'success'
      }
    }
    const allSessionsHaveAssessments = () => {
      return (
        !_.isEmpty(scheduleSource?.sessions) &&
        !scheduleSource?.sessions!.find(session =>
          _.isEmpty(session.assessments)
        )
      )
    }

    //Sets up the data from the intro page
    const createScheduleAndNameStudy = async (
      studyId: string,
      studyName: string,
      duration: string,
      start: StartEventId
    ) => {
      const studySession = ScheduleService.createEmptyScheduleSession(start)
      let schedule: Schedule = {
        guid: '',
        name: studyId,
        duration,
        sessions: [studySession],
      }
      const newSchedule = await ScheduleService.createSchedule(
        studyId,
        schedule,
        token!
      )

      const updatedStudy: Study = {...study!, name: studyName}

      mutateSchedule({
        studyId: studyId,
        schedule: newSchedule,
        action: 'CREATE',
      }).then(s => console.log('schedule created'))

      mutateStudy({study: updatedStudy}).then(e => {
        console.log('study updated')
        alert(e.name)
      })
    }

    const saveStudy = async (
      passedStudy: Study = study!,
      saveButtonPressed?: boolean
    ): Promise<Study | undefined> => {
      setHasObjectChanged(true)
      setSaveLoader(true)
      setDisplayBanner(false)
      try {
        const updatedStudy = await mutateStudy({
          study: passedStudy,
        })
        console.log('us', updatedStudy)
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

    const saveSchedule = async (
      _updatedSchedule?: Schedule,
      saveButtonPressed?: boolean
    ): Promise<Schedule | undefined> => {
      setError([])
      setSchedulerErrors([])
      setDisplayBanner(false)
      console.log('START UPDATE')
      if (!study) {
        throw Error('You need to create a study before adding a schedule')
      }
      try {
        setSaveLoader(true)
        const updatedSchedule = _updatedSchedule || schedule
        if (!updatedSchedule || !token) {
          return undefined
        }
        /*
        const savedUpdatedSchedule = await ScheduleService.saveSchedule(
          study.identifier,
          updatedSchedule,
          token
        )*/
        const savedUpdatedSchedule = await mutateSchedule({
          studyId: study.identifier,
          schedule: updatedSchedule,
          action: 'UPDATE',
        })
        //we have the issue that scheduler comes back from the server without assessment resources
        //so we need to copy the resources back to the new schedule object before updating.
        //the reason why we want the updated object is that sessions ids get assigned by the server.
        //potentially we might just want to do it in that case, but this seems to be performane

        const oldSessionAssessments = updatedSchedule.sessions.reduce(function (
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
        //updating schedule will update the study so bump the version.

        /*  setData({
          ...builderInfo,
          schedule: savedUpdatedSchedule,
          study: {...builderInfo.study, version: builderInfo.study.version + 1},
        })*/
        console.log('END UPDATE')
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

    /* const changeSection = async (next: StudySection) => {
      ;`/studies/builder/${id}/scheduler`

     
      if (section === next || !allSessionsHaveAssessments()) {
        return
      }

      let saveFn: Function | undefined = undefined
      //where we are currently
      switch (section) {
        case 'scheduler': {
          saveFn = async () => {
            await saveStudy(undefined)
            return await saveSchedule(undefined)
          }
          break
        }
        case 'session-creator': {
          saveFn = saveSchedule
          break
        }
        case 'launch': {
          const missingIrbInfo =
            !study.irbDecisionType ||
            !study.irbDecisionOn ||
            !study.irbExpiresOn
          if (missingIrbInfo) {
            delete study.irbDecisionOn
            delete study.irbExpiresOn
            delete study.irbDecisionType
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

      let updatedObject: Study | Schedule | undefined
      if (saveFn && hasObjectChanged) {
        updatedObject = await saveFn()
      }
      if (updatedObject || !hasObjectChanged) {
        window.history.pushState(null, '', next)
        Utility.setBodyClass(next)
        setSection(next)
      }
    }*/

    const navButtons = (
      <NavButtons
        id={id}
        key={`${id}_nav_button`}
        currentSection={section}
        disabled={!allSessionsHaveAssessments()}></NavButtons>
    )

    const navButtonsArray = [
      <NavButtons
        id={id}
        key={`${id}_p_button`}
        currentSection={section}
        isPrevOnly={true}
      />,
      <NavButtons
        id={id}
        key={`${id}_n_button`}
        currentSection={section}
        isNextOnly={true}></NavButtons>,
    ]

    const getClasses = () => {
      return clsx(classes.mainArea, {
        [classes.mainAreaNormalWithLeftNav]: open,
        [classes.mainAreaWideWithLeftNav]:
          open && ['customize', 'scheduler'].includes(section),
        [classes.mainAreaNoLeftNav]: !open,
        [classes.mainAreaWideNoLeftNav]:
          !open && ['customize', 'scheduler'].includes(section),

        [classes.negativeTop]: ['scheduler'].includes(section),
      })
    }

    return (
      <Box bgcolor={section === 'scheduler' ? '#E5E5E5' : '#f7f7f7'}>
        <Box display="flex" bgcolor="#f7f7f7">
          <TopErrorBanner
            backgroundColor={bannerType?.bgColor!}
            textColor={bannerType?.textColor!}
            onClose={() => setDisplayBanner(false)}
            isVisible={displayBanner}
            icon={bannerType?.icon[0]!}
            isSelfClosing={bannerType?.type === 'success'}
            displayBottomOfPage={
              bannerType?.type !== 'success' && bannerType?.type !== 'error'
            }
            displayText={bannerType?.displayText[0]!}></TopErrorBanner>
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
          {hasObjectChanged ? 'object changed' : 'no change'}
        </span>
        <Container
          maxWidth="xl"
          className={classes.studyComponentContainer}
          style={{
            backgroundColor:
              section === 'session-creator' ||
              section === 'enrollment-type-selector' ||
              section === 'preview'
                ? '#f7f7f7'
                : 'inherit',
          }}>
          <Box paddingTop={2} display="flex" position="relative">
            <StudyLeftNav
              open={open}
              onToggle={() => setOpen(prev => !prev)}
              currentSection={section}
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
                  <LoadingComponent reqStatusLoading={!study}>
                    {study && !schedule && !isScheduleLoading ? (
                      <Box className={classes.introInfoContainer}>
                        <IntroInfo
                          studyName={study.name}
                          onContinue={(
                            studyName: string,
                            duration: string,
                            startEventId: StartEventId
                          ) => {
                            createScheduleAndNameStudy(
                              study.identifier,
                              studyName,
                              duration,
                              startEventId
                            )
                          }}></IntroInfo>
                      </Box>
                    ) : (
                      study &&
                      schedule && (
                        <Switch>
                          <Route path={`/studies/builder/:id/session-creator`}>
                            <SessionCreator
                              id={id}
                              /* onSave={() => saveSchedule()}
                              sessions={schedule?.sessions || []}
                              onUpdate={(data: StudySession[]) => {
                                setHasObjectChanged(true)
                                saveSchedule({
                                  ...schedule!,
                                  sessions: data,
                                })
                              }}*/
                            >
                              {navButtons}
                            </SessionCreator>
                          </Route>
                          <Route path={`/studies/builder/:id/scheduler`}>
                            <Scheduler
                              id={id}
                              token={token!}
                              schedule={schedule!}
                              study={study}
                              hasObjectChanged={hasObjectChanged}
                              saveLoader={saveLoader}
                              onSave={(isSavePressed: boolean) => {
                                saveStudy(undefined).then(() =>
                                  saveSchedule(undefined, isSavePressed)
                                )
                              }}
                              onUpdate={(
                                schedule?: Schedule,
                                events?: SchedulingEvent[]
                              ) => {
                                setHasObjectChanged(true)

                                if (schedule) {
                                  /*mutateSchedule({
                                    studyId: study.identifier,
                                    action: 'UPDATE',
                                    schedule,
                                    isPassive: true,
                                  })()*/
                                  setSchedule(schedule)
                                }
                                if (events) {
                                  const cData = study.clientData
                                  cData.events = events
                                  let studyUpdate = {
                                    ...study,
                                    clientData: cData,
                                  }
                                  /* mutateStudy({
                                    study: studyUpdate,
                                    isPassive: true,
                                  })*/
                                  setStudy(studyUpdate)
                                }
                              }}
                              schedulerErrors={schedulerErrors}
                              isReadOnly={!StudyService.isStudyInDesign(study)}>
                              {navButtonsArray}
                            </Scheduler>
                          </Route>
                          <Route
                            path={`/studies/builder/:id/enrollment-type-selector`}>
                            <EnrollmentTypeSelector id={id}>
                              {navButtons}
                            </EnrollmentTypeSelector>
                          </Route>
                          <Route path={`/studies/builder/:id/customize`}>
                            <AppDesign
                              hasObjectChanged={hasObjectChanged}
                              saveLoader={saveLoader}
                              study={study}
                              onSave={() => {
                                saveStudy(study, true)
                              }}
                              onUpdate={(updatedStudy: Study) => {
                                setHasObjectChanged(true)
                                setStudy({...updatedStudy})
                                /*mutateStudy({
                                  study: updatedStudy,

                                  isPassive: true,
                                })*/
                              }}
                              onError={(error: string) =>
                                setError(prev => [...prev, error])
                              }>
                              {navButtons}
                            </AppDesign>
                          </Route>

                          <Route path={`/studies/builder/:id/preview`}>
                            <Preview
                              studyId={study.identifier}
                              token={token!}
                              scheduleSessions={schedule.sessions}></Preview>
                          </Route>
                          <Route path={`/studies/builder/:id/launch`}>
                            <Launch
                              hasObjectChanged={hasObjectChanged}
                              saveLoader={saveLoader}
                              study={study}
                              schedule={schedule}
                              onSave={() =>
                                saveStudy({
                                  ...study,
                                  phase: 'recruitment',
                                })
                              }
                              onUpdate={(study: Study) => {
                                setHasObjectChanged(true)
                                mutateStudy({
                                  study,

                                  isPassive: true,
                                })
                              }}>
                              <NavButtons
                                id={id}
                                currentSection={section}
                                isPrevOnly={true}
                                disabled={
                                  !allSessionsHaveAssessments()
                                }></NavButtons>
                            </Launch>
                          </Route>
                          <Route path={`/studies/builder/:id/passive-features`}>
                            <PassiveFeatures
                              study={study}
                              hasObjectChanged={hasObjectChanged}
                              saveLoader={saveLoader}
                              onUpdate={(data: BackgroundRecorders) => {
                                setHasObjectChanged(true)
                                const updatedStudy = {
                                  ...study,
                                }
                                updatedStudy.clientData.backgroundRecorders =
                                  data

                                saveStudy(updatedStudy)
                              }}>
                              {navButtons}
                            </PassiveFeatures>
                          </Route>
                        </Switch>
                      )
                    )}
                  </LoadingComponent>
                </ErrorBoundary>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }

export default StudyBuilder
