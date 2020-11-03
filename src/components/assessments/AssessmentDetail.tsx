import {
  Box,
  Container,
  createStyles,
  makeStyles,
  Paper,
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'

import { Link, RouteComponentProps, useParams } from 'react-router-dom'
import { isClassExpression } from 'typescript'
import { useAsync } from '../../helpers/AsyncHook'
import { useSessionDataState } from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import { Assessment } from '../../types/types'
import BreadCrumb from '../widgets/BreadCrumb'

const useStyles = makeStyles(theme =>
  createStyles({
    breadCrumbs: {
      backgroundColor: '#E5E5E5',
      padding: `${theme.spacing(7)}px ${theme.spacing(5)}px  ${theme.spacing(
        5,
      )}px  ${theme.spacing(5)}px`,
    },
  }),
)

type AssessmentDetailOwnProps = {
  // assessment?: Assessment
}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = (
  {
    //assessment,
  },
) => {
  const { token } = useSessionDataState()
  const classes = useStyles()
  const links = [{ url: '/assessments', text: 'Assessments' }]

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
    return run(AssessmentService.getAssessmentsWithResources(id, token))
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <>
        <Paper className={classes.breadCrumbs}>
          <BreadCrumb
            links={links}
            currentItem={data?.assessments[0].title}
          ></BreadCrumb>
        </Paper>
        <Container maxWidth="lg" style={{ textAlign: 'center' }}>
          <Paper>
            <h2>assessment.img</h2>
            <p>{data?.assessments[0].title}</p>
          </Paper>
        </Container>
      </>
    )
  }
  return <></>
}

export default AssessmentDetail
