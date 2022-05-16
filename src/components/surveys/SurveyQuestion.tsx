import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import {Survey} from './types'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type SurveyQuestionOwnProps = {
  studyId?: string
}

type SurveyQuestionProps = SurveyQuestionOwnProps & RouteComponentProps

const SurveyQuestion: FunctionComponent<SurveyQuestionProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  const [survey, setSurvey] = React.useState<Survey>()
  return (
    <Box>
      <p>
        Survey must support data type input integers 0-100 with label Example:
        User is presented “How would you rate your overall mood right now?” Bad
        - Good [0-100 scale] user inputs an integer from 0-100
      </p>

      <p>
        Survey must support data type input string value pairs Example:
        <pre>
          "choices": [ "text": "Without any difficulty", "value": 5 "text":
          "With a little difficulty", "value": 4 "text": "With some difficulty",
          "value": 3 "text": "With much difficulty", "value": 2 "text": "Unable
          to do", "value": 1
        </pre>
      </p>

      <p>Survey must support data type input date and date range</p>

      <p>Survey must support data type input Boolean</p>

      <p>
        Survey must support data type input Free text (max char = 250? or allow
        researcher to set? multiple line must scroll) enter min/max range, regex
      </p>
      <p>
        Survey must support data type input time [hours:min], [AM/PM] time
        [00:00] 24hr clock and time range based on user setting on phone. format
        is same for both.
      </p>

      <p>
        Survey must support data type input multiple choice single select
        multi-select All of the above None of the above Prefer not to say Other
      </p>
    </Box>
  )
}
