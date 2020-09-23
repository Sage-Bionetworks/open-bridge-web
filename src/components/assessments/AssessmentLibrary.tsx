import React, { FunctionComponent } from 'react'
import AssessmentCard from './AssessmentCard'

import { RouteComponentProps } from 'react-router-dom'

import { Grid, Paper, makeStyles, Hidden } from '@material-ui/core'
import clsx from 'clsx'

import useAssessments from './../../helpers/hooks'

type AssessmentLibraryOwnProps = {}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 20,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    border: '1px solid black',
    fontFamily: 'Roboto',
  },
}))

type AssessmentLibraryProps = AssessmentLibraryOwnProps & RouteComponentProps

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = props => {
  const classes = useStyles()
  const assessments = useAssessments()

  return (
    <>
      <Grid
        container
        // ...
      >
        <Grid item sm={3} implementation="css" xsDown component={Hidden} />
        <Grid item xs={12} sm={9}>
          <Paper className={classes.paper}>xs=12search</Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper}>xs=12 sm=6 filter</Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Paper className={classes.paper}>
            <div className={clsx('assesmentContainer', 'testMe')}>
              {assessments.map((a, index) => (
                <AssessmentCard index={index} assessment={a}></AssessmentCard>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default AssessmentLibrary
