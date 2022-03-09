import Utility from '@helpers/utility'
import {Box, makeStyles} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import ControlSelector from './ControlSelector'
import QuestionEdit from './QuestionEdit'
import QuestionList from './QuestionList'
import _survey from './sample.json'
import {Step, Survey} from './types'

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
  //@ts-ignore
  const [survey, setSurvey] = React.useState<Survey>(_survey)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >()
  const getQuestionList = (): Step[] => {
    return survey.steps.map(s => ({
      identifier: s.identifier,
      title: s.title,
      type: s.type,
    }))
  }
  const addStep = (title: string) => {
    const newStep: Step = {
      identifier: Utility.generateNonambiguousCode(6, 'ALPHANUMERIC'),
      title,
      type: 'unkonwn',
    }
    const currentStepId = survey.steps.length
    setSurvey(pre => ({...pre, steps: [...pre.steps, newStep]}))
    setCurrentStepIndex(currentStepId)
  }

  const updateCurrentStep = (step: Step) => {
    if (currentStepIndex) {
      let steps = [...survey.steps]
      steps[currentStepIndex] = step
      setSurvey(prev => ({...prev, steps}))
    }
  }

  const getCurrentStep = () =>
    currentStepIndex !== undefined ? survey.steps[currentStepIndex] : undefined

  return (
    <>
      <pre>{JSON.stringify(survey.steps[currentStepIndex || 0], null, 4)}</pre>
      <Box bgcolor="#F8F8F8" px={5} display="flex">
        <QuestionList
          currentStepIndex={currentStepIndex}
          steps={getQuestionList()}
          onAdd={(title: string) => addStep(title)}
          onNavigate={(identifier: string) => {
            setCurrentStepIndex(
              survey.steps.findIndex(s => s.identifier == identifier)
            )
          }}
        />
        <Box py={0} pr={3} pl={2}>
          <QuestionEdit
            onChange={step => updateCurrentStep(step)}
            step={getCurrentStep()}
          />
        </Box>
        {currentStepIndex && (
          <Box>
            <ControlSelector
              step={getCurrentStep()!}
              onChange={step => updateCurrentStep(step)}
            />
          </Box>
        )}
      </Box>
    </>
  )
}
export default Surveys
