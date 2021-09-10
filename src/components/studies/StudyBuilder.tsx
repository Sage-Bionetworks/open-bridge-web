import {useSchedule} from '@components/studies/scheduleHooks'
import {useStudy} from '@components/studies/studyHooks'
import {Box, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'
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
import {Schedule} from '../../types/scheduling'
import {
  ExtendedError,
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
import ReadOnlyScheduler from './scheduler/read-only-pages/ReadOnlyScheduler'
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
  () => {
    const classes = useStyles()
    const {url, path} = useRouteMatch()
    let {id, section = 'session-creator'} = useParams<{
      id: string
      section: StudySection
    }>()

    const {
      data: scheduleSource,
      error: scheduleError,
      isLoading: isScheduleLoading,
    } = useSchedule(id)
    const {
      data: studySource,
      error: studyError,
      isLoading: isStudyLoading,
    } = useStudy(id)
    const [study, setStudy] = React.useState<Study | undefined>()
    const [schedule, setSchedule] = React.useState<Schedule | undefined>()
    const [error, setError] = React.useState<string>()
    const handleError = useErrorHandler()
    const [open, setOpen] = React.useState(true)
    const [displayBanner, setDisplayBanner] = React.useState(false)
    const [cancelBanner, setCancelBanner] = React.useState(false)
    const [bannerType, setBannerType] = React.useState<{
      bgColor: string
      displayText: string[]
      icon: string[]
      textColor: string
      type: string
    }>()

    React.useEffect(() => {
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
        const banner = getBannerType(study.phase, !!error)
        const bannerType = BannerInfo.bannerMap.get(banner)
        setBannerType(bannerType)

        if (banner !== 'success' && banner !== 'error' && !cancelBanner) {
          setDisplayBanner(true)
        }
      }
    }, [study?.phase, section, error, cancelBanner])

    if (studyError || scheduleError) {
      if (studyError || (scheduleError && scheduleError.statusCode !== 404)) {
        handleError(studyError)
      }
    }

    const getBannerType = (phase: StudyPhase, hasError: boolean) => {
      const displayPhase = StudyService.getDisplayStatusForStudyPhase(phase)
      if (displayPhase !== 'DRAFT') {
        return displayPhase
      }
      return hasError ? 'error' : 'success'
    }
    const allSessionsHaveAssessments = () => {
      return (
        !_.isEmpty(scheduleSource?.sessions) &&
        !scheduleSource?.sessions!.find(session =>
          _.isEmpty(session.assessments)
        )
      )
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

        [classes.negativeTop]:
          ['scheduler'].includes(section) &&
          study &&
          StudyService.isStudyInDesign(study),
      })
    }

    const showFeedback = (e?: ExtendedError) => {
      if (e) {
        if (e.statusCode === 401) {
          handleError(e)
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
          setError(e.message)
        }
      } else {
        setError(undefined)
      }
      setDisplayBanner(true)
    }

    return (
      <Box bgcolor={section === 'scheduler' ? '#E5E5E5' : '#f7f7f7'}>
        <Box display="flex" bgcolor="#f7f7f7">
          <TopErrorBanner
            backgroundColor={bannerType?.bgColor!}
            textColor={bannerType?.textColor!}
            onClose={() => {
              setCancelBanner(true)
              setDisplayBanner(false)
            }}
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
                  reqStatusLoading={isStudyLoading || isScheduleLoading}
                  variant="small"
                  loaderSize="2rem"
                  style={{
                    width: '2rem',
                    position: 'absolute',
                    top: '30px',
                    left: '50%',
                  }}></LoadingComponent>
                {!_.isEmpty(error) &&
                  (Array.isArray(error) || (!!error && error.length > 1)) && (
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
                        <IntroInfo studyName={study.name} id={id}></IntroInfo>
                      </Box>
                    ) : (
                      study &&
                      schedule && (
                        <Switch>
                          <Route path={`/studies/builder/:id/scheduler`}>
                            {!StudyService.isStudyInDesign(study) ? (
                              <ReadOnlyScheduler
                                schedule={schedule}
                                studyId={id}>
                                {navButtons}
                              </ReadOnlyScheduler>
                            ) : (
                              <Scheduler id={id} onShowFeedback={showFeedback}>
                                {navButtonsArray}
                              </Scheduler>
                            )}
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
                                showFeedback({message: error, name: error})
                              }>
                              {navButtons}
                            </AppDesign>
                          </Route>

                          <Route path={`/studies/builder/:id/preview`}>
                            <Preview id={id}></Preview>
                          </Route>
                          <Route path={`/studies/builder/:id/launch`}>
                            <Launch id={id}>{navButtons}</Launch>
                          </Route>
                          <Route path={`/studies/builder/:id/passive-features`}>
                            <PassiveFeatures id={id}>
                              {navButtons}
                            </PassiveFeatures>
                          </Route>
                          <Route>
                            <SessionCreator id={id}>
                              {navButtons}
                            </SessionCreator>
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
