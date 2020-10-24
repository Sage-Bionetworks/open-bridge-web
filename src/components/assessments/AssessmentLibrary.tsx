import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  match,
  RouteComponentProps,
  useParams,
  Link,
  Route,
} from 'react-router-dom'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import LoadingComponent from '../widgets/Loader'
import { useAsync } from '../../helpers/AsyncHook'

import { Grid, Paper, makeStyles, Hidden } from '@material-ui/core'
import clsx from 'clsx'

//import useAssessments from './../../helpers/hooks'
import { useSessionDataState } from '../../helpers/AuthContext'
import { Assessment } from '../../types/types'
import AssessmentService from '../../services/assessment.service'
import AssessmentCard from './AssessmentCard'
import AssessmentDetail from './AssessmentDetail'

type AssessmentLibraryOwnProps = {
  assessments?: Assessment[]
  tags?: string[]
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  cardLink: {
    textDecoration: 'none'

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

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({
  match,
}: AssessmentLibraryProps) => {
  const classes = useStyles()
  //const assessments = useAssessments()
  const { token } = useSessionDataState()

  let { id } = useParams<{ id: string }>()

  const handleError = useErrorHandler()

  const { data, status, error, run, setData } = useAsync<{
    assessments: Assessment[]
    tags: string[]
  }>({
    status: 'PENDING',
    data: null,
  })
  React.useEffect(() => {
    ///your async call
    return run(AssessmentService.getSharedAssessmentsWithResources())
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <>
        <Grid
          container
          // ...
        >
          <Grid item sm={3} implementation="css" xsDown component={Hidden} />
          <Grid item xs={12} sm={9}>
            <Paper className={classes.paper}>xs=12search {token}</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>xs=12 sm=6 filter</Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper className={classes.paper}>
              <div className={clsx('assesmentContainer', 'testMe')}>
                {data?.assessments?.map((a, index) => (
                  <Link to={`${match.url}/${a.guid}`} className={classes.cardLink}>
                    <AssessmentCard
                      index={index}
                      assessment={a}
                      key={a.guid}
                    ></AssessmentCard>
                  </Link>
                ))}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  }
  return <>nothing</>
}

export default AssessmentLibrary
