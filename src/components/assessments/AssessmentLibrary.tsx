import makeStyles from '@mui/styles/makeStyles';
import React, {FunctionComponent, useState} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link, RouteComponentProps} from 'react-router-dom'
import {useAsync} from '../../helpers/AsyncHook'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import {Assessment, StringDictionary} from '../../types/types'
import Loader from '../widgets/Loader'
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

  const {token} = useUserSessionDataState()

  const handleError = useErrorHandler()

  const [filteredAssessments, setFilteredAssessments] = useState<
    Assessment[] | undefined
  >(undefined)

  const {data, status, error, run} = useAsync<{
    assessments: Assessment[]
    tags: StringDictionary<number>
  }>({
    status: 'PENDING',
    data: null,
  })

  React.useEffect(() => {
    ///your async call
    return run(AssessmentService.getAssessmentsWithResources())
  }, [run, token])

  if (status === 'REJECTED') {
    handleError(error!)
  }

  if (status === 'RESOLVED' && (!data?.assessments || !data?.tags)) {
    return <>No Data </>
  }

  return (
    <Loader reqStatusLoading={status} variant="full">
      {data && (
        <AssessmentLibraryWrapper
          tags={data.tags}
          token={token}
          assessments={data.assessments}
          onChangeTags={
            (assessments: Assessment[]) =>
              setFilteredAssessments(assessments) /*setFilterTags(tags)*/
          }>
          {(filteredAssessments || data.assessments).map((a, index) => (
            <Link
              to={`${match.url}/${a.guid}`}
              className={classes.cardLink}
              key={a.guid}>
              <AssessmentCard
                index={index}
                assessment={a}
                key={a.guid}></AssessmentCard>
            </Link>
          ))}
        </AssessmentLibraryWrapper>
      )}
    </Loader>
  )
}

export default AssessmentLibrary
