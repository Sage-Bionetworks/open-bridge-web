import makeStyles from '@mui/styles/makeStyles'
import {useAssessmentsWithResources} from '@services/assessmentHooks'
import React, {FunctionComponent, useState} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link, RouteComponentProps} from 'react-router-dom'
import {Assessment, ViewType} from '../../types/types'
import Loader from '../widgets/Loader'
import AssessmentCard from './AssessmentCard'
import AssessmentLibraryWrapper from './AssessmentLibraryWrapper'
import AssessmentSmall from './AssessmentSmall'

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
  const handleError = useErrorHandler()

  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[] | undefined>(undefined)
  const [viewMode, setViewMode] = React.useState<ViewType>('GRID')
  const {data, isError, error, status, isLoading} = useAssessmentsWithResources(false, false)
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

          {(filteredAssessments || data.assessments).map((a, index) => (
            <Link to={`${match.url}/${a.guid}`} className={classes.cardLink} key={a.guid}>
              {viewMode === 'GRID' ? (
                <AssessmentCard index={index} assessment={a} key={a.guid}></AssessmentCard>
              ) : (
                <AssessmentSmall assessment={a} key={a.guid} hasHover={false}></AssessmentSmall>
              )}
            </Link>
          ))}
        </AssessmentLibraryWrapper>
      )}
    </Loader>
  )
}

export default AssessmentLibrary
