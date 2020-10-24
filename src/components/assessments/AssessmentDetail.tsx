import { Box } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'

import { Link, RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useSessionDataState } from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import { Assessment } from '../../types/types'
import BreadCrumb from '../widgets/BreadCrumb'


type AssessmentDetailOwnProps = {
 // assessment?: Assessment
}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = ({
  //assessment,
}) => {
  const { token } = useSessionDataState()
  const links = [{url: '/assessments', text: 'Assessments'}]

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
    return run(AssessmentService.getSharedAssessmentsWithResources(id))
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <Box>
        <BreadCrumb links={links} currentItem={data?.assessments[0].title}></BreadCrumb>

        <h2>assessment.img</h2>
        <p>{data?.assessments[0].title}</p>
      </Box>
    )
  }
  return <></>
}

export default AssessmentDetail
