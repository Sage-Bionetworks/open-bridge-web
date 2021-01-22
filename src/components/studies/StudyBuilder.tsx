import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { Route, RouteComponentProps, Switch, useParams } from 'react-router-dom'
import { useStudy } from '../../helpers/hooks'
import { ThemeType } from '../../style/theme'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import LoadingComponent from '../widgets/Loader'
import AppDesign from './app-design/AppDesign'
import Launch from './launch/Launch'
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
 
  let { id, section } = useParams<{ id: string; section: StudySection }>()
  const [nextSection, setNextSection] = React.useState<StudySection>(section)
  const { data: study, status, error } = useStudy(id)

  const [open, setOpen] = React.useState(true)

  if (status === 'IDLE') {
    return <>'no id'</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    if (!study) {
      throw new Error('This session does not exist')
    }
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
                {study && (
                  <Switch>
                    <Route
                      path="/studies/builder/:id/scheduler"
                      render={props => {
                        return (
                          <Scheduler
                            {...props}
                            id={id}
                            section={section}
                            nextSection={nextSection}
                          ></Scheduler>
                        )
                      }}
                    />
                    <Route
                      path="/studies/builder/:id/session-creator"
                      render={props => {
                        return (
                          <SessionCreator
                            {...props}
                            id={id}
                            nextSection={nextSection}
                            section={section}
                          />
                        )
                      }}
                    />

                    <Route
                      path="/studies/builder/:id/branding"
                      render={props => {
                        return (
                          <AppDesign {...props} id={id} section={section}   nextSection={nextSection}/>
                        )
                      }}
                    />

                    <Route
                      path="/studies/builder/:id/launch"
                      render={props => {
                        return <Launch {...props} id={id} section={section}          nextSection={nextSection}/>
                      }}
                    />

<Route
                      path="/studies/builder/:id/passive-features"
                      render={props => {
                        return <PassiveFeatures {...props} id={id} section={section}          nextSection={nextSection}/>
                      }}
                    />
                  </Switch>
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
