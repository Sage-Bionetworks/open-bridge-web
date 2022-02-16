import {Box, makeStyles, TextField} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import {Survey} from './types'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type SurveysOwnProps = {
  studyId?: string
}

type SurveysProps = SurveysOwnProps & RouteComponentProps

const Surveys: FunctionComponent<SurveysProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  const [survey, setSurvey] = React.useState<Survey>()

  return (
    <Box bgcolor="#F8F8F8" px={5}>
      <Box py={0} pr={3} pl={2}>
        Surveys
      </Box>
      <Box>
        Survey name
        <pre>
          {`
  "type": "assessment",
  "identifier": "foo",
  "versionString": "1.2.3",
  "schemaIdentifier":"bar",
  "title": "Hello World!",
  "subtitle": "Subtitle",
  "detail": "Some text. This is a test.",
  "estimatedMinutes": 4,
  "icon": "fooIcon",
  "footnote": "This is a footnote.",
  "actions": { "goForward": { "type": "default", "buttonTitle" : "Go, Dogs! Go!" },
    "cancel": { "type": "default", "iconName" : "closeX" }
  }`}
        </pre>
        <TextField id="title" label="Title" variant="outlined" />
        <TextField id="subtitle" label="Subtitle" variant="outlined" />
        <TextField id="detail" label="detail" variant="outlined" multiline />
        <TextField
          id="footnote"
          label="footnote"
          variant="outlined"
          multiline
        />
        <TextField
          id="estimatedMinutes"
          label="estimatedMinutes"
          type="number"
          variant="outlined"
        />
      </Box>
    </Box>
  )
}
export default Surveys
