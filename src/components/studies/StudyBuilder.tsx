import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import { useStudyBuilderInfo } from '../../helpers/hooks'
import StudyService from '../../services/study.service'
import { ThemeType } from '../../style/theme'
import { Schedule, StudyDuration } from '../../types/scheduling'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import Launch from './launch/Launch'
import NavButtons from './NavButtons'
import PassiveFeatures from './passive-features/PassiveFeatures'
import Scheduler from './scheduler/Scheduler'
import { StudySection } from './sections'
import SessionCreator from './session-creator/SessionCreator'
import StudyLeftNav from './StudyLeftNav'
import StudyTopNav from './StudyTopNav'

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
    width: `${280 * 3 + 16 * 3}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 2 + 16 * 2}px`,
    },
  },

  mainAreaWider: {
    width: `${280 * 4 + 16 * 3}px`,
    [theme.breakpoints.down('md')]: {
      width: `760px`,
    },
  },
  mainAreaWide: {
    width: `${280 * 4 + 16 * 4}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 3 + 16 * 3}px`,
    },
  },
}))

type StudyBuilderOwnProps = {}

type StudyBuilderProps = StudyBuilderOwnProps & RouteComponentProps

const StudyBuilder: FunctionComponent<StudyBuilderProps> = ({
  ...otherProps
}) => {
  const classes = useStyles()
  const handleError = useErrorHandler()

  let { id, section: _section } = useParams<{
    id: string
    section: StudySection
  }>()
  const [section, setSection] = React.useState(_section)
  const [nextSection, setNextSection] = React.useState<StudySection>(_section)
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const { token } = useUserSessionDataState()
  const { data: builderInfo, status, error, setData } = useStudyBuilderInfo(id)

  const [open, setOpen] = React.useState(true)

  const saveStudySessions = async () => {
    setSaveLoader(true)
    await StudyService.saveStudySessions(
      id,
      builderInfo!.schedule.sessions || [],
      token!,
    )
    setHasObjectChanged(false)
    setSaveLoader(false)
    return
  }

  const saveSchedulerData = async () => {
    setSaveLoader(true)
    await StudyService.saveStudySchedule(
      id,
      builderInfo!.schedule,
      builderInfo!.study.studyDuration!,
      token!,
    )
    setHasObjectChanged(false)
    setSaveLoader(false)
    return
  }

  if (status === 'IDLE') {
    return <>'no id'</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED' && builderInfo) {
    if (!builderInfo.study) {
      throw new Error('This session does not exist')
    }
  }
  if (!builderInfo) {
    return <></>
  }

  const changeSection = async (next: StudySection) => {
    if (section === next) {
      return
    }

    let saveFn: Function | undefined = undefined
    //where we are currently
    switch (section) {
      case 'scheduler': {
        saveFn = saveSchedulerData
        break
      }
      case 'session-creator': {
        saveFn = saveStudySessions
        break
      }
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
    setSection(next)
  }

  const navButtons = (
    <NavButtons
      id={id}
      currentSection={section}
      onNavigate={(section: StudySection) => changeSection(section)}
    ></NavButtons>
  )

  const ChildComponent: FunctionComponent<{}> = (): JSX.Element => {
    const props = {
      hasObjectChanged: hasObjectChanged,
      saveLoader: saveLoader,
    }
    switch (section) {
      case 'scheduler':
        return <></>
      case 'session-creator':
        return (
          <SessionCreator
            {...props}
            id={id}
            onSave={() => saveStudySessions()}
            sessions={builderInfo.schedule?.sessions || []}
            onUpdate={(data: StudySection[]) => {
              //console.log(_section)
              setHasObjectChanged(true)
              setData({
                ...builderInfo,
                schedule: { ...builderInfo.schedule, sessions: data },
              })
            }}
          >
            {navButtons}
          </SessionCreator>
        )
      case 'branding':
        return (
          <AppDesign
            {...props}
            id={id}
            onUpdate={(_section: StudySection, data: any) => {
              console.log(_section)
              // moveToNextSection(_section)
            }}
          >
            {navButtons}
          </AppDesign>
        )
      case 'launch':
        return (
          <Launch
            {...props}
            id={id}
            onUpdate={(_section: StudySection, data: any) => {
              console.log(_section)
              // moveToNextSection(_section)
            }}
          >
            {navButtons}
          </Launch>
        )
      case 'passive-features':
        return (
          <PassiveFeatures
            {...props}
            id={id}
            onUpdate={(_section: StudySection, data: any) => {
              console.log(_section)
              // moveToNextSection(_section)
            }}
          >
            {navButtons}
          </PassiveFeatures>
        )

      default:
        return <></>
    }
  }

  return (
    <>
      <StudyTopNav studyId={id} currentSection={section}></StudyTopNav>
      <span> {hasObjectChanged ? 'object changed' : 'no change'}</span>
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
              [classes.mainAreaWider]: open && section === 'scheduler',
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

            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}
            >
              <LoadingComponent reqStatusLoading={status || !builderInfo}>
                {builderInfo && (
                  <>
                    {section === 'scheduler' && (
                      <Scheduler
                        id={id}
                        schedule={builderInfo.schedule}
                        studyDuration={builderInfo.study?.studyDuration}
                        hasObjectChanged={hasObjectChanged}
                        saveLoader={saveLoader}
                        onSave={() => saveSchedulerData()}
                        onUpdate={({
                          schedule,
                          studyDuration,
                        }: {
                          schedule: Schedule
                          studyDuration: StudyDuration
                        }) => {
                          setHasObjectChanged(true)
                          console.log('updating duration', studyDuration)
                          setData({
                            ...builderInfo,
                            schedule: schedule,
                            study: {
                              ...builderInfo.study,
                              studyDuration,
                            },
                          })
                        }}
                      >
                        {navButtons}
                      </Scheduler>
                    )}

                    <ChildComponent></ChildComponent>
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
