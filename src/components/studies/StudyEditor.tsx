import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'

import clsx from 'clsx'
import { Study } from '../../types/types'
import { CssVariablesType, ThemeType } from '../../style/theme'
import { RouteComponentProps, useParams } from 'react-router-dom'

import { Box, Button, Grid, Link } from '@material-ui/core'
import { JsxElement } from 'typescript'
import Scheduler from './scheduler/Scheduler'
import SessionsCreator from './session-creator/SessionsCreator'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback, ErrorHandler } from '../../helpers/ErrorHandler'
import { SECTIONS as sectionLinks, StudySection } from './sections'
import LeftNav from './LeftNav'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    width: '300px',
    border: '1px solid gray',
  },

  title: {
    fontSize: 14,
    color: theme.testColor,
  },
  pos: {
    marginBottom: 12,
  },
}))

type StudyEditorOwnProps = {}

type StudyEditorProps = StudyEditorOwnProps & RouteComponentProps

const StudyEditor: FunctionComponent<StudyEditorProps> = ({ ...props }) => {
  const classes = useStyles()
  let { id, section } = useParams<{ id: string; section: StudySection }>()

  const servePage = (section: StudySection): JSX.Element => {
    switch (section) {
      case 'scheduler':
        return <Scheduler {...props}></Scheduler>
      case 'session-creator':
        return <SessionsCreator {...props}></SessionsCreator>
      default:
        return <></>
    }
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
          href={`/studies/${id}/${section.path}`}
        >
          {section.name}
        </Button>
      )
    }
    const result = (
      <Box position="fixed"   bottom={24}  right={24} >

        <NavLink id={id} section={prev}></NavLink>&nbsp;&nbsp;
        <NavLink id={id} section={next}></NavLink>
       
        </Box>
    )
    return result
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} sm={2}>
        <LeftNav currentSection={section} id={id}></LeftNav>
      </Grid>
      <Grid item xs={9} sm={10}>
        <div>
          Stage here{id} {section}
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={ErrorHandler}
          >
            {servePage(section)}
          </ErrorBoundary>
          <NavLinks sections={sectionLinks} currentSection={section}></NavLinks>
        </div>
      </Grid>
    </Grid>
  )
}

export default StudyEditor
