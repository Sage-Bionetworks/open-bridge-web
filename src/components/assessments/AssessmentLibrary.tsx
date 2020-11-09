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

import {
  Grid,
  Paper,
  makeStyles,
  Hidden,
  Box,
  Container,
  Slider,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import clsx from 'clsx'

//import useAssessments from './../../helpers/hooks'
import { useSessionDataState } from '../../helpers/AuthContext'
import { Assessment, StringDictionary } from '../../types/types'
import AssessmentService from '../../services/assessment.service'
import AssessmentCard from './AssessmentCard'
import AssessmentDetail from './AssessmentDetail'
import AssessmentLibraryFilter from './AssessmentLibraryFilter'
import AssessmentLibraryWrapper from './AssessmentLibraryWrapper'


type AssessmentLibraryOwnProps = {
  assessments?: Assessment[]
  tags?: string[]
}



const useStyles = makeStyles(theme => ({

  cardLink: {
    textDecoration: 'none',
  }
}))

type AssessmentLibraryProps = AssessmentLibraryOwnProps & RouteComponentProps

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({
  match,
}: AssessmentLibraryProps) => {
  const classes = useStyles()

  const { token } = useSessionDataState()

  const handleError = useErrorHandler()

  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]| undefined>(undefined)

  const { data, status, error, run, setData } = useAsync<{
    assessments: Assessment[]
    tags: StringDictionary<number>
  }>({
    status: 'PENDING',
    data: null,
  })


  React.useEffect(() => {
    ///your async call
    return run(AssessmentService.getAssessmentsWithResources(undefined, token))
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  if (!data?.assessments || (!data?.tags && status === 'RESOLVED')) {
    return <>No Data </>
  }

  return (
  <AssessmentLibraryWrapper tags={data.tags} assessments={data.assessments} onChangeTags={(assessments: Assessment[])=> setFilteredAssessments(assessments)/*setFilterTags(tags)*/}>
      {(filteredAssessments|| data.assessments).map(
            (a, index) => (
              <Link to={`${match.url}/${a.guid}`} className={classes.cardLink}     key={a.guid}>
                <AssessmentCard
                  index={index}
                  assessment={a}
                  key={a.guid}
                ></AssessmentCard>
              </Link>
            ),
          )}
  </AssessmentLibraryWrapper>
  )
}

export default AssessmentLibrary
