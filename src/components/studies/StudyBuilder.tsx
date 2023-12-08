import {ErrorFallback, ErrorHandler} from '@components/widgets/ErrorHandler'
import {Alert, Box, Container, SxProps} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useSchedule} from '@services/scheduleHooks'
import StudyService from '@services/study.service'
import {useStudy} from '@services/studyHooks'
import {theme, ThemeType} from '@style/theme'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {Route, RouteComponentProps, Switch, useParams} from 'react-router-dom'
import {ExtendedError, Study} from '../../types/types'
import AlertBanner from '../widgets/AlertBanner'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import BannerInfo, {BannerInfoType} from './BannerInfo'
import EnrollmentTypeSelector from './enrollment-type-selector/EnrollmentTypeSelector'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import Preview from './preview/Preview'
import IntroInfo from './scheduler/IntroInfo'
import Scheduler from './scheduler/Scheduler'
import {isSectionEditableWhenLive, StudySection} from './sections'
import SessionCreator from './session-creator/SessionCreator'
import StudyBuilderHeader from './StudyBuilderHeader'
import StudyLeftNav from './StudyLeftNav'

// TODO: syoung 12/08/2023 figure out it this is needed or remove
// const subtitles: StringDictionary<string> = {
//   description: 'Description',
//   'team-settings': 'Team Settings',
//   scheduler: 'Schedule Sessions',
//   'session-creator': 'Create Sessions',
//   customize: 'Customize your App',
//   'enrollment-type-selector': 'Participant Study Enrollment',
//   'passive-features': 'Optional Background Monitoring',
//   launch: 'Launch Study Requirements',
// }

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
    [theme.breakpoints.down('xl')]: {
      width: `905px`,
    },

    [theme.breakpoints.down('lg')]: {
      width: `610px`,
    },
  },

  mainAreaWideWithLeftNav: {
    width: `1600px`,
    [theme.breakpoints.down('xl')]: {
      width: `1100px`,
    },
    [theme.breakpoints.down('lg')]: {
      width: `768px`,
    },
  },
  mainAreaNoLeftNav: {
    width: `1500px`,
    [theme.breakpoints.down('xl')]: {
      width: '1200px', //`${(280+32) * 4 + 16 * 4}px`,
    },
    [theme.breakpoints.down('lg')]: {
      width: `910px`,
    },
  },
  mainAreaWideNoLeftNav: {
    width: `1700px`,
    [theme.breakpoints.down('xl')]: {
      width: '1200px', //`${(280+32) * 4 + 16 * 4}px`,
    },
    [theme.breakpoints.down('lg')]: {
      width: `910px`,
    },
  },
  introInfoContainer: {
    textAlign: 'center',
    minHeight: '100vh',
    paddingTop: theme.spacing(5),
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

export const BuilderWrapper: FunctionComponent<{sectionName: string; isReadOnly?: boolean; sx?: SxProps}> = ({
  isReadOnly,
  sectionName,
  children,
  ...sx
}) => {
  return (
    <Box
      id="workArea"
      sx={{
        backgroundColor: '#FBFBFC',
        paddingLeft: theme.spacing(8),
        paddingTop: isReadOnly ? theme.spacing(0) : theme.spacing(4),
        paddingBottom: theme.spacing(8),
        paddingRight: theme.spacing(8),
        height: isReadOnly ? '100%' : 'auto',
      }}>
      {/*<MTBHeadingH1 sx={{textAlign: 'left'}}>{sectionName}</MTBHeadingH1>*/}

      <Box pt={3} id="builderContainer" sx={{height: isReadOnly ? '100%' : 'auto', ...sx}}>
        {children}
      </Box>
    </Box>
  )
}

const StudyBuilder: FunctionComponent<StudyBuilderProps & RouteComponentProps> = () => {
  const classes = useStyles()
  let {id, section = 'study-details'} = useParams<{
    id: string
    section: StudySection
  }>()

  const {data: schedule, isLoading: isScheduleLoading} = useSchedule(id)
  const {data: studySource, isLoading: isStudyLoading} = useStudy(id)
  const [study, setStudy] = React.useState<Study | undefined>()

  const [error, setError] = React.useState<string>()
  const handleError = useErrorHandler()
  const [open, setOpen] = React.useState(true)
  const [displayFeedbackBanner, setDisplayFeedbackBanner] = React.useState(false)

  const [feedbackBannerType, setFeedbackBannerType] = React.useState<BannerInfoType | undefined>()

  React.useEffect(() => {
    //if (!study) {
    setStudy(studySource)
    //  }
  }, [studySource])

  React.useEffect(() => {
    if (study) {
      setFeedbackBannerType(getFeedbackBannerInfo(!!error))
    }
  }, [study, error])

  const getFeedbackBannerInfo = (hasError: boolean) => {
    const bannerType = hasError ? 'error' : 'success'
    return BannerInfo.bannerMap.get(bannerType)
  }

  const allSessionsHaveAssessments = () => {
    return !_.isEmpty(schedule?.sessions) && !schedule?.sessions!.find(session => _.isEmpty(session.assessments))
  }

  const navButtons = (
    <NavButtons
      study={study}
      key={`${id}_nav_button`}
      currentSection={section}
      isPrevOnly={section === 'launch'}
      disabled={!allSessionsHaveAssessments()}></NavButtons>
  )

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

  const hideFeedback = () => {
    setDisplayFeedbackBanner(false)
  }

  return (
    <Box id="studyBuilder">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
        <Container
          maxWidth="xl"
          className={classes.studyComponentContainer}
          style={
            {
              /*  backgroundColor:
              section === 'session-creator' ||
              section === 'scheduler' ||
              section === 'enrollment-type-selector' ||
              section === 'preview'
                ? 'rgba(135, 142, 149, 0.1)'
                : 'inherit',*/
            }
          }>
          <Box paddingTop={0} sx={{display: 'flex', position: 'relative', minHeight: '100vh'}}>
            <StudyLeftNav
              open={open}
              onToggle={() => setOpen(prev => !prev)}
              currentSection={section}
              study={study!}
              hasSchedule={!!schedule}
              disabled={!allSessionsHaveAssessments()}></StudyLeftNav>
            <Box className={classes.mainAreaWrapper} id="mainAreaWrapper">
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
              {study && (
                <StudyBuilderHeader
                  study={study}
                  isReadOnly={
                    (!isSectionEditableWhenLive(section) && !StudyService.isStudyInDesign(study)) ||
                    StudyService.isStudyClosedToEdits(study)
                  }
                />
              )}
              {!_.isEmpty(error) && (Array.isArray(error) || (!!error && error.length > 1)) && (
                <Alert variant="outlined" color="error" style={{marginBottom: '16px'}}>
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

              <LoadingComponent reqStatusLoading={!study}>
                <Box id="builderWorkArea" sx={{height: '100%'}}>
                  {study && (
                    <Switch>
                      <Route path={`/studies/builder/:id/scheduler`}>
                        <Scheduler
                          id={id}
                          onShowFeedback={showFeedback}
                          onHideFeedback={hideFeedback}
                          isReadOnly={!StudyService.isStudyInDesign(study)}>
                          {navButtons}
                        </Scheduler>
                      </Route>
                      <Route path={`/studies/builder/:id/enrollment-type-selector`}>
                        <EnrollmentTypeSelector id={id}>{navButtons}</EnrollmentTypeSelector>
                      </Route>
                      <Route path={`/studies/builder/:id/customize`}>
                        <AppDesign id={id} onShowFeedback={showFeedback}>
                          {navButtons}
                        </AppDesign>
                      </Route>

                      <Route path={`/studies/builder/:id/preview`}>
                        <Preview id={id}> {navButtons}</Preview>
                      </Route>
                      <Route path={`/studies/builder/:id/launch`}>
                        <Launch id={id} onShowFeedback={showFeedback}>
                          {navButtons}
                        </Launch>
                      </Route>
                      <Route path={`/studies/builder/:id/passive-features`}>
                        <PassiveFeatures id={id}>{navButtons}</PassiveFeatures>
                      </Route>
                      <Route path={`/studies/builder/:id/session-creator`}>
                        <SessionCreator
                          id={id}
                          isReadOnly={!StudyService.isStudyInDesign(study)}
                          onShowFeedback={showFeedback}>
                          {navButtons}
                        </SessionCreator>
                      </Route>
                      <Route>
                        <IntroInfo
                          id={id}
                          studyName={study.name}
                          isReadOnly={!StudyService.isStudyInDesign(study)}
                          onShowFeedback={showFeedback}>
                          {navButtons}
                        </IntroInfo>
                      </Route>
                    </Switch>
                  )}
                </Box>
              </LoadingComponent>
            </Box>
          </Box>
        </Container>
      </ErrorBoundary>
    </Box>
  )
}

export default StudyBuilder
