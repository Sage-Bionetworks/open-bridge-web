import makeStyles from '@mui/styles/makeStyles'
import {useAssessmentsWithResources} from '@services/assessmentHooks'
import {FunctionComponent, useState} from 'react'

import {Link, RouteComponentProps, useLocation} from 'react-router-dom'
import {Assessment, ExtendedError} from '../../types/types'
import Loader from '../widgets/Loader'
import AssessmentCard from './AssessmentCard'
import AssessmentLibraryWrapper from './AssessmentLibraryWrapper'
import AssessmentTable from './AssessmentsTable'
import useViewToggle from './ViewHook'

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

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({match}: AssessmentLibraryProps) => {
  const classes = useStyles()
  //const handleError = useErrorHandler()
  //const view = new URLSearchParams(useLocation().search).get('view')

  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[] | undefined>(undefined)
  const [viewMode, setViewMode] = useViewToggle(useLocation().search)
  const {data, isError, error, status, isLoading} = useAssessmentsWithResources(false, false)
  console.log('data', data)
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
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onChangeAssessmentsType={() => {}}
          onChangeTags={(assessments: Assessment[]) => setFilteredAssessments(assessments) /*setFilterTags(tags)*/}>
          {/*    {surveys?.assessments &&
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
            ))}*/}

          {viewMode === 'GRID' ? (
            <>
              {(filteredAssessments || data.assessments).map((a, index) => (
                <Link to={`${match.url}/${a.guid}`} className={classes.cardLink} key={a.guid}>
                  <AssessmentCard index={index} assessment={a} key={a.guid}></AssessmentCard>
                </Link>
              ))}
            </>
          ) : (
            <AssessmentTable assessments={filteredAssessments || data.assessments} match={match} />
          )}
        </AssessmentLibraryWrapper>
      )}
    </Loader>
  )
}

export default AssessmentLibrary
function handleError(arg0: ExtendedError) {
  throw new Error('Function not implemented.')
}
