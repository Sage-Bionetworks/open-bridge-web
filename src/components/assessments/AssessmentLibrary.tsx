import { makeStyles } from '@material-ui/core'
import React, { FunctionComponent, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
//import useAssessments from './../../helpers/hooks'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import { Assessment, StringDictionary } from '../../types/types'
import AssessmentCard from './AssessmentCard'
import AssessmentLibraryWrapper from './AssessmentLibraryWrapper'

type AssessmentLibraryOwnProps = {
  assessments?: Assessment[]
  tags?: string[]
}

const useStyles = makeStyles(theme => ({
  cardLink: {
    textDecoration: 'none',
  },
}))

type AssessmentLibraryProps = AssessmentLibraryOwnProps & RouteComponentProps

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({
  match,
}: AssessmentLibraryProps) => {
  const classes = useStyles()

  const { token } = useUserSessionDataState()

  const handleError = useErrorHandler()

  const [filteredAssessments, setFilteredAssessments] = useState<
    Assessment[] | undefined
  >(undefined)

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
    <AssessmentLibraryWrapper
      tags={data.tags}
      assessments={data.assessments}
      onChangeTags={
        (assessments: Assessment[]) =>
          setFilteredAssessments(assessments) /*setFilterTags(tags)*/
      }
    >
      {(filteredAssessments || data.assessments).map((a, index) => (
        <Link
          to={`${match.url}/${a.guid}`}
          className={classes.cardLink}
          key={a.guid}
        >
          <AssessmentCard
            index={index}
            assessment={a}
            key={a.guid}
          ></AssessmentCard>
        </Link>
      ))}
    </AssessmentLibraryWrapper>
  )
}

export default AssessmentLibrary
