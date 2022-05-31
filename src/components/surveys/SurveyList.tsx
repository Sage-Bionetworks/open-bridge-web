import Loader from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import {Box, Button} from '@mui/material'
import {useAssessments} from '@services/assessmentHooks'
import constants from '@typedefs/constants'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link, Redirect} from 'react-router-dom'

const SurveyList: React.FunctionComponent<{}> = () => {
  const handleError = useErrorHandler()
  const {data: surveys, status, error} = useAssessments(true)
  const [isNew, setIsNew] = React.useState(false)
  if (error) {
    handleError(error)
  }
  if (isNew) {
    return <Redirect to={`${constants.restrictedPaths.SURVEY_BUILDER}/intro`} />
  }
  return (
    <>
      <Button
        disabled={
          !Utility.isPathAllowed(
            'any',
            constants.restrictedPaths.SURVEY_BUILDER
          )
        }
        variant="contained"
        onClick={e => setIsNew(true)}>
        + Create Survey
      </Button>
      <Loader reqStatusLoading={status === 'loading'}>
        {surveys?.map((survey, index) => (
          <Link
            style={{textDecoration: 'none'}}
            key={survey.identifier || index}
            to={`/surveys/${survey.guid!}/design`}>
            <Box p={4} m={4} sx={{border: 1}}>
              {survey.title}: {survey.identifier}
            </Box>
          </Link>
        ))}
      </Loader>
    </>
  )
}
export default SurveyList
