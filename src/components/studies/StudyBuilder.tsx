import {useSchedule} from '@components/studies/scheduleHooks'
import {useStudy} from '@components/studies/studyHooks'
import StudyIdWithPhaseImage from '@components/widgets/StudyIdWithPhaseImage'
import {Box, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Alert} from '@material-ui/lab'
import StudyService from '@services/study.service'
import {ThemeType} from '@style/theme'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {Route, RouteComponentProps, Switch, useParams} from 'react-router-dom'
import {Schedule} from '../../types/scheduling'
import {ExtendedError, StringDictionary, Study} from '../../types/types'
import AlertBanner from '../widgets/AlertBanner'
import {ErrorFallback, ErrorHandler} from '../widgets/ErrorHandler'
import {MTBHeadingH1} from '../widgets/Headings'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import BannerInfo, {BannerInfoType} from './BannerInfo'
import EnrollmentTypeSelector from './enrollment-type-selector/EnrollmentTypeSelector'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import Preview from './preview/Preview'
import IntroInfo from './scheduler/IntroInfo'
import ReadOnlyScheduler from './scheduler/read-only-pages/ReadOnlyScheduler'
import Scheduler from './scheduler/Scheduler'
import {isSectionEditableWhenLive, StudySection} from './sections'
import SessionCreator from './session-creator/SessionCreator'
import StudyLeftNav from './StudyLeftNav'

const subtitles: StringDictionary<string> = {
  description: 'Description',
  'team-settings': 'Team Settings',
  scheduler: 'Schedule Sessions',
  'session-creator': 'Create Sessions',
  customize: 'Customize your App',
  'enrollment-type-selector': 'Participant Study Enrollment',
  'passive-features': 'Optional Background Monitoring',
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
    const [displayFeedbackBanner, setDisplayFeedbackBanner] =
      React.useState(false)
    const [displayEditabilityBanner, setDisplayEditabilityBanner] =
      React.useState(false)
    const [cancelBanner, setCancelBanner] = React.useState(false)
    const [editabilityBannerType, setEditabilityBannerType] = React.useState<
      BannerInfoType | undefined
    >()
    const [feedbackBannerType, setFeedbackBannerType] = React.useState<
      BannerInfoType | undefined
    >()

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
        setFeedbackBannerType(getFeedbackBannerInfo(!!error))
        setEditabilityBannerType(getEditabilityBannerInfo(study))
        if (!StudyService.isStudyInDesign(study)) {
          setDisplayEditabilityBanner(true)
        }
      }
    }, [study?.phase, study, section, cancelBanner, error])

    const getFeedbackBannerInfo = (hasError: boolean) => {
      const bannerType = hasError ? 'error' : 'success'
      return BannerInfo.bannerMap.get(bannerType)
    }

    const getEditabilityBannerInfo = (study: Study) => {
      const phase = study.phase

      const displayPhase = StudyService.getDisplayStatusForStudyPhase(phase)
      if (displayPhase === 'DRAFT') {
        return
      }
      const bannerInfo = BannerInfo.bannerMap.get(displayPhase)
      // const isEditable = isSectionEditableWhenLive(section)
      //return {bannerType, isEditable}
      return bannerInfo
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
      setDisplayFeedbackBanner(true)
    }

    return (
      <Box bgcolor={section === 'scheduler' ? '#E5E5E5' : '#f7f7f7'}>
        <Box display="flex" bgcolor="#f7f7f7">
          <AlertBanner
            backgroundColor={feedbackBannerType?.bgColor!}
            textColor={feedbackBannerType?.textColor!}
            onClose={() => {
              //setCancelBanner(true)
              setDisplayFeedbackBanner(false)
            }}
            isVisible={displayFeedbackBanner}
            icon={feedbackBannerType?.icon[0]!}
            isSelfClosing={feedbackBannerType?.type === 'success'}
            displayBottomOfPage={false}
            displayText={feedbackBannerType?.displayText[0]!}></AlertBanner>
          {study && (
            <AlertBanner
              backgroundColor={editabilityBannerType?.bgColor!}
              textColor={editabilityBannerType?.textColor!}
              onClose={() => {
                // setCancelBanner(true)
                setDisplayEditabilityBanner(false)
              }}
              isVisible={displayEditabilityBanner}
              icon={
                isSectionEditableWhenLive(section) &&
                StudyService.getDisplayStatusForStudyPhase(study.phase) ===
                  'LIVE'
                  ? editabilityBannerType?.icon[1]!
                  : editabilityBannerType?.icon[0]!
              }
              isSelfClosing={false}
              displayBottomOfPage={true}
              displayText={
                isSectionEditableWhenLive(section) &&
                StudyService.getDisplayStatusForStudyPhase(study.phase) ===
                  'LIVE'
                  ? editabilityBannerType?.displayText[1]!
                  : editabilityBannerType?.displayText[0]!
              }></AlertBanner>
          )}
          <Box width={open ? 210 : 56} flexShrink={0} pl={5} pt={2}>
            <StudyIdWithPhaseImage study={study} excludedPhase="DRAFT" />
          </Box>
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
              study={study!}
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
                              }
                              onShowFeedback={showFeedback}>
                              {navButtons}
                            </AppDesign>
                          </Route>

                          <Route path={`/studies/builder/:id/preview`}>
                            <Preview id={id}></Preview>
                          </Route>
                          <Route path={`/studies/builder/:id/launch`}>
                            <Launch id={id} onShowFeedback={showFeedback}>
                              {navButtons}
                            </Launch>
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
