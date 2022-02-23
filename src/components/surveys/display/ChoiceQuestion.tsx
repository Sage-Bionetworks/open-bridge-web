import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  makeStyles,
  Typography,
} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import test from '../sample.json'
import {Survey} from '../types'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type ChoiceQuestionOwnProps = {
  studyId?: string
}

type ChoiceQuestionProps = ChoiceQuestionOwnProps /*& RouteComponentProps*/

const SurveyDisplay: FunctionComponent<ChoiceQuestionProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  const [survey, setSurvey] = React.useState<Survey>()
  return (
    <Box>
      <h1> {test.title}</h1>
      <h2> {test.subtitle}</h2>
      <p>{test.detail}</p>
      <p>minutes: {test.estimatedMinutes}</p>
      <Box>
        {test.steps.map(step => (
          <Accordion>
            <AccordionSummary key={step.identifier} id={step.identifier}>
              <Typography>{step.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{step.detail}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
export default SurveyDisplay
