import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Study } from '../../types/types'
import { ThemeType } from '../../style/theme'
import { Route, RouteComponentProps, useParams } from 'react-router-dom'

import { Box, Button, Grid, Link } from '@material-ui/core'
import { Switch, matchPath } from 'react-router-dom'
import Scheduler from './scheduler/Scheduler'
import SessionCreator from './session-creator/SessionCreator'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import LoadingComponent from '../widgets/Loader'
import { SECTIONS as sectionLinks, StudySection } from './sections'
import StudyLeftNav from './StudyLeftNav'
import { useAsync } from '../../helpers/AsyncHook'
import StudyService from '../../services/study.service'
import clsx from 'clsx'
import { TurnedInNotOutlined } from '@material-ui/icons'
import StudyTopNav from './StudyTopNav'

const useStyles = makeStyles((theme: ThemeType) => ({
  mainArea: {
    margin: '0 auto',
    minHeight: '100px',
    backgroundColor: '#cacacd',
  },
  mainAreaNormal: {
    width: `${280 * 3 + 16 * 3}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 2 + 16 * 2}px`,
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

  const { data: study, status, error, run } = useAsync<Study>({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  const [open, setOpen] = React.useState(true)

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudy(id))
  }, [id, run])

  if (status === 'IDLE') {
    return <>'no id'</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    if (!study) {
      throw new Error('This session does not exist')
    }
  }

  const getStudySessions = (study: Study) => {
    //const sessions = study.groups.map(group => group.sessions).flat()
   // return StudyService.getStudySessions()

  }

  const NavLinks = ({
    sections,
    currentSection,
  }: {
    sections: { name: string; path: StudySection }[]
    currentSection: StudySection
  }) => {
    const currentIndex = sections.findIndex(i => i.path === currentSection)
    const prev = currentIndex > 0 ? sections[currentIndex - 1] : undefined
    const next =
      currentIndex + 1 < sections.length
        ? sections[currentIndex + 1]
        : undefined

    const NavLink = (props: any) => {
      const { id, section } = props
      if (!section) {
        return <></>
      }
      return (
        <Button
          variant="contained"
          color="primary"
  
          href={`/studies/builder/${id}/${section.path}`}
        >
          {section.name}
        </Button>
      )
    }
    const result = (
      <Box position="fixed" bottom={24} right={24}>
        <NavLink id={id} section={prev}></NavLink>&nbsp;&nbsp;
        <NavLink id={id} section={next}></NavLink>
      </Box>
    )
    return result
  }

  return (
    <>
    <StudyTopNav studyId={id} currentSection={section}></StudyTopNav>
    <Box
      paddingTop="16px"
      bgcolor="#997cbf29"
      display="flex"
      position="relative"
    >
   
      <StudyLeftNav
        open={open}
        onToggle={() => setOpen(prev => !prev)}
        currentSection={section}
        id={id}
      ></StudyLeftNav>

      <Box textAlign="center" flexGrow="1" bgcolor="#dde0de">
        <Box
          className={clsx(classes.mainArea, {
            [classes.mainAreaNormal]: open,
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
                      return <Scheduler {...props}   studySessions={study.sessions}></Scheduler>
                    }}
                  />
                  <Route
                    path="/studies/builder/:id/session-creator"
                    render={props => {
                      return (
                        <SessionCreator
                          {...props}
                          studySessions={study.sessions}
                        />
                      )
                    }}
                  />
                </Switch>
              )}

              <NavLinks
                sections={sectionLinks}
                currentSection={section}
              ></NavLinks>
            </LoadingComponent>
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
    </>
  )
}

export default StudyBuilder
