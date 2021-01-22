import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useStudyBuilderInfo } from '../../helpers/hooks'
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

const StudyBuilder: FunctionComponent<StudyBuilderProps> = ({ ...props }) => {
  const classes = useStyles()
  const handleError = useErrorHandler()

  let { id, section: _section } = useParams<{
    id: string
    section: StudySection
  }>()
  const [section, setSection] = React.useState(_section)
  const [nextSection, setNextSection] = React.useState<StudySection>(_section)
  //const { data: study, status, error } = useStudy(id)
  const { data: builderInfo, status, error, setData } = useStudyBuilderInfo(id)

  const [open, setOpen] = React.useState(true)

  function moveToNextSection(_section: StudySection) {
    window.history.pushState(null, '', _section)
    setSection(_section)
  }

  if (status === 'IDLE') {
    return <>'no id'</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    if (!builderInfo?.study) {
      throw new Error('This session does not exist')
    }
  }
  if (!builderInfo) {
    return <></>
  }

  return (
    <>
      <StudyTopNav studyId={id} currentSection={section}></StudyTopNav>
      <Box paddingTop="16px" display="flex" position="relative">
        <StudyLeftNav
          open={open}
          onToggle={() => setOpen(prev => !prev)}
          currentSection={section}
          onNavigate={(loc: StudySection) => {
            console.log(loc)
            console.log('setting')

            setNextSection(loc)
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
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}
            >
              <LoadingComponent reqStatusLoading={status}>
                {section === 'scheduler' && (
                  <Scheduler
                    {...props}
                    id={id}
                    section={section}
                    nextSection={nextSection}
                    schedule={builderInfo.schedule}
                    studyDuration={builderInfo.study?.studyDuration}
                    onNavigate={(
                      section: StudySection,
                      data: {
                        schedule: Schedule
                        studyDuration: StudyDuration
                      },
                    ) => {
                      setData({
                        ...builderInfo,
                        schedule: data.schedule,
                        study: {
                          ...builderInfo.study,
                          duration: data.studyDuration,
                        },
                      })
                      moveToNextSection(section)
                    }}
                  >
                    <NavButtons
                      id={id}
                      currentSection={section}
                      onNavigate={(next: StudySection) => setNextSection(next)}
                    ></NavButtons>
                  </Scheduler>
                )}
                {section === 'session-creator' && (
                  <SessionCreator
                    {...props}
                    id={id}
                    nextSection={nextSection}
                    section={section}
                    sessions={builderInfo.schedule?.sessions || []}
                    onNavigate={(
                      _section: StudySection,
                      data: StudySection[],
                    ) => {
                      console.log(_section)
                      setData({
                        ...builderInfo,
                        schedule: { ...builderInfo.schedule, sessions: data },
                      })

                      moveToNextSection(_section)

                      console.log('section' + section)
                    }}
                  >
                    <NavButtons
                      id={id}
                      currentSection={section}
                      onNavigate={(next: StudySection) => setNextSection(next)}
                    ></NavButtons>
                  </SessionCreator>
                )}

                {section === 'branding' && (
                  <AppDesign
                    {...props}
                    id={id}
                    section={section}
                    nextSection={nextSection}
                    onNavigate={(_section: StudySection, data: any) => {
                      console.log(_section)
                      moveToNextSection(_section)
                    }}
                  >
                    <NavButtons
                      id={id}
                      currentSection={section}
                      onNavigate={(next: StudySection) => setNextSection(next)}
                    ></NavButtons>
                  </AppDesign>
                )}

                {section === 'launch' && (
                  <Launch
                    {...props}
                    id={id}
                    section={section}
                    nextSection={nextSection}
                    onNavigate={(_section: StudySection, data: any) => {
                      console.log(_section)
                      moveToNextSection(_section)
                    }}
                  >
                    <NavButtons
                      id={id}
                      currentSection={section}
                      onNavigate={(next: StudySection) => setNextSection(next)}
                    ></NavButtons>
                  </Launch>
                )}

                {section === 'passive-features' && (
                  <PassiveFeatures
                    {...props}
                    id={id}
                    section={section}
                    nextSection={nextSection}
                    onNavigate={(_section: StudySection, data: any) => {
                      console.log(_section)
                      moveToNextSection(_section)
                    }}
                  >
                    <NavButtons
                      id={id}
                      currentSection={section}
                      onNavigate={(next: StudySection) => setNextSection(next)}
                    ></NavButtons>
                  </PassiveFeatures>
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
