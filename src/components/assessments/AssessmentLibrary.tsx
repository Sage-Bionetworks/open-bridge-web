import makeStyles from '@mui/styles/makeStyles'
import {useAssessmentsWithResources} from '@services/assessmentHooks'
import {FunctionComponent, useState} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link, RouteComponentProps} from 'react-router-dom'
import {Assessment} from '../../types/types'
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
  const handleError = useErrorHandler()

  const [filteredAssessments, setFilteredAssessments] = useState<
    Assessment[] | undefined
  >(undefined)

  const {data, isError, error, status, isLoading} = useAssessmentsWithResources(
    false,
    false
  )
  const {data: surveys} = useAssessmentsWithResources(false, true)

  if (isError) {
    handleError(error!)
  }

  if (status === 'success' && (!data?.assessments || !data?.tags)) {
    return <>No Data </>
  }

  return (
    <Loader reqStatusLoading={isLoading} variant="full">
      {data && (
        <AssessmentLibraryWrapper
          assessments={data.assessments}
          assessmentsType="OTHER"
          onChangeAssessmentsType={() => {}}
          onChangeTags={
            (assessments: Assessment[]) =>
              setFilteredAssessments(assessments) /*setFilterTags(tags)*/
          }>
          {surveys?.assessments &&
            (surveys?.assessments).map((a, index) => (
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
