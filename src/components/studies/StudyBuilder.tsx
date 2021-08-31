import {useSchedule, useUpdateSchedule} from '@components/studies/scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '@components/studies/studyHooks'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'
import ScheduleService from '@services/schedule.service'
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
import {Schedule, StartEventId} from '../../types/scheduling'
import {StringDictionary, Study, StudyPhase} from '../../types/types'
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
      console.log('rerendering builder')
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

    const navButtons = (
      <NavButtons
        id={id}
        key={`${id}_nav_button`}
        currentSection={section}
        isPrevOnly={section === 'launch'}
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
                            <SessionCreator id={id}>
                              {navButtons}
                            </SessionCreator>
                          </Route>
                          <Route path={`/studies/builder/:id/scheduler`}>
                            <Scheduler
                              id={id}
                              onSave={(isSavePressed: boolean) => {
                                alert('alina to do')
                              }}>
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
                              id={id}
                              onError={(error: string) =>
                                setError(prev => [...prev, error])
                              }>
                              {navButtons}
                            </AppDesign>
                          </Route>

                          <Route path={`/studies/builder/:id/preview`}>
                            <Preview id={study.identifier}></Preview>
                          </Route>
                          <Route path={`/studies/builder/:id/launch`}>
                            <Launch id={id}>{navButtons}</Launch>
                          </Route>
                          <Route path={`/studies/builder/:id/passive-features`}>
                            <PassiveFeatures id={id}>
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
