import React, { FunctionComponent } from 'react'
import { makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'

import clsx from 'clsx'
import { Study } from '../../types/types'
import { CssVariablesType, ThemeType } from '../../style/theme'
import { RouteComponentProps, useParams } from 'react-router-dom'
import LeftNav, {StudySection} from './LeftNav'
import { Grid } from '@material-ui/core'
import { JsxElement } from 'typescript'
import Scheduler from './scheduler/Scheduler'
import SessionsCreator from './session-creator/SessionsCreator'

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

  const servePage = (section: StudySection ): JSX.Element => {
    switch (section) {
      case 'scheduler':
        return <Scheduler {...props}></Scheduler>
      case 'sessions-creator':
        return <SessionsCreator {...props}></SessionsCreator>
        default:
          return <></>
    
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} sm={2}>
        <LeftNav currentSection={section} id={id}></LeftNav>
      </Grid>
      <Grid item xs={9} sm={10}>
        <div>
          Stage here{id} {section}
          {servePage(section)}
        </div>
      </Grid>
    </Grid>
  )
}

export default StudyEditor
