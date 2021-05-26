import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import clsx from 'clsx'
import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataDispatch,
  useStudyInfoDataState,
} from '../../helpers/StudyInfoContext'
import { setBodyClass } from '../../helpers/utility'
import AssessmentService from '../../services/assessment.service'
import StudyService from '../../services/study.service'
import { ThemeType } from '../../style/theme'
import { Schedule, StartEventId, StudySession } from '../../types/scheduling'
import {
  Assessment,
  BackgroundRecorders,
  StringDictionary,
  Study,
} from '../../types/types'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import { MTBHeadingH1 } from '../widgets/Headings'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import EnrollmentTypeSelector from './enrollment-type-selector/EnrollmentTypeSelector'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import Preview from './preview/Preview'
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
  branding: 'Customize your App',
  'enrollment-type-selector': 'Participant Study Enrollment',
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
    minHeight: '100vh',
    paddingTop: theme.spacing(5),
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
  const [error, setError] = React.useState<string[]>([])
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const { token } = useUserSessionDataState()
  const builderInfo: StudyInfoData = useStudyInfoDataState()
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const [open, setOpen] = React.useState(true)

  const setData = (builderInfo: StudyInfoData) => {
    studyDataUpdateFn({ type: 'SET_ALL', payload: builderInfo })
  }
  //Sets up the data from the intro page
  const createScheduleAndNameStudy = async (
    studyId: string,
    studyName: string,
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
      name: studyName,
    }
    const newVersion = await StudyService.updateStudy(updatedStudy, token!)
    updatedStudy.version = newVersion
    setData({ schedule: newSchedule, study: updatedStudy })
  }

  const saveStudy = async (study: Study) => {
    setHasObjectChanged(true)
    setSaveLoader(true)

    try {
      const newVersion = await StudyService.updateStudy(study, token!)
      const updatedStudy = { ...study, version: newVersion }
      setData({
        ...builderInfo,
        study: updatedStudy,
      })
      setError([])

      setHasObjectChanged(false)
      return updatedStudy
    } catch (e) {
      setError(e.message)
    } finally {
      setSaveLoader(false)
    }
  }

  const saveStudySchedule = async (updatedSchedule?: Schedule) => {
    setError([])
    try {
      setSaveLoader(true)
      const schedule = updatedSchedule || builderInfo.schedule
      if (!schedule || !token) {
        return
      }
      const savedUpdatedSchedule = await StudyService.saveStudySchedule(
        schedule,
        token,
        builderInfo.study.identifier, //this is temporary
      )
      //we have the issue that scheduler comes back from the server without assessment resources
      //so we need to copy the resources back to the new schedule object before updating.
      //the reason why we want the updated object is that sessions ids get assigned by the server.
      //potentially we might just want to do it in that case, but this seems to be performane

      const oldSessionAssessments = schedule.sessions.reduce(function (
        prev,
        curr,
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
            oa => oa.guid === assessment.guid,
          )?.resources
        })
      })
      console.log('studyVersion in SB', savedUpdatedSchedule.version)
      setData({
        ...builderInfo,
        schedule: savedUpdatedSchedule,
        study: { ...builderInfo.study, version: builderInfo.study.version + 1 }, //temporary to get notifications working
      })
      setHasObjectChanged(false)
    } catch (e) {
      console.log(e, 'error')
      const entity = e.entity
      const errors = e.errors
      const ks = Object.keys(errors)
      ks.forEach((key, index) => {
        const keyArr = key.split('.')
        //first session, timewindow, message
        var numberPattern = /\d+/g

        let windowIndex
        const sessionIndex = _.first(keyArr[0]?.match(numberPattern))
        // if 3 levels - assume window
        if (keyArr.length > 2) {
          windowIndex = _.first(keyArr[1]?.match(numberPattern))
        }
        const errorType = keyArr[keyArr.length - 1]
        const errorMessage = errors[key]
          .map((error: string) => error.replace(key, ''))
          .join(',')

        const sessionName = sessionIndex
          ? entity.sessions[sessionIndex[0]].name
          : ''
        const finalError = `${sessionName}-${
          sessionIndex ? parseInt(sessionIndex) + 1 : 0
        }${
          windowIndex ? ';Window' + (parseInt(windowIndex) + 1) : ''
        };${errorType};${errorMessage}`
        setError(prev => [...prev, finalError])
      })
      // displayError(e.errors)
    } finally {
      setSaveLoader(false)
    }
  }

  const displayError = (errors: StringDictionary<string>) => {
    try {
      const errorKeys = Object.keys(errors)
      console.log(errorKeys)
    } catch (e) {}
    return errors
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
        <IntroInfo
          onContinue={(
            studyName: string,
            duration: string,
            startEventId: StartEventId,
          ) => {
            createScheduleAndNameStudy(
              builderInfo.study.identifier,
              studyName,
              duration,
              startEventId,
            )
          }}
        ></IntroInfo>
      </Box>
    )
  }

  return (
    <>
      <Box display="flex" bgcolor="white">
        <Box width={open ? 210 : 56} flexShrink={0}></Box>
        <Box
          className={clsx(classes.mainArea, {
            [classes.mainAreaNormal]: open,
            [classes.mainAreaWider]:
              open && ['branding', 'scheduler'].includes(section),
            [classes.mainAreaWide]: !open,
          })}
          pt={8}
          pl={2}
        >
          <MTBHeadingH1>{subtitles[section as string]}</MTBHeadingH1>
        </Box>
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
            {!_.isEmpty(error) && section !== 'scheduler' && (
              <Alert variant="outlined" color="error">
                {Array.isArray(error) ? (
                  error.map(e => <div style={{ textAlign: 'left' }}>1{e}</div>)
                ) : (
                  <div style={{ textAlign: 'left' }}>{error}2</div>
                )}
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
                        version={builderInfo.schedule?.version}
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
                        errors={error}
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
                          /* setData({
                            ...builderInfo,
                            schedule: {
                              ...builderInfo.schedule!,
                              sessions: data,
                            },
                          })*/
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
                        study={builderInfo.study}
                        onSave={(updatedStudy: Study) => {
                          saveStudy(builderInfo.study)
                        }}
                        onUpdate={(study: Study) => {
                          setHasObjectChanged(true)
                          setData({
                            ...builderInfo,
                            study: study,
                          })
                        }}
                      >
                        {navButtons}
                      </AppDesign>
                    )}
                    {section === 'preview' && (
                      <Preview
                        studyId={builderInfo.study.identifier}
                        token={token!}
                      ></Preview>
                    )}
                    {section === 'launch' && (
                      <Launch
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        study={builderInfo.study}
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
                        features={
                          builderInfo.study.clientData.backgroundRecorders
                        }
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
