import Utility from '@helpers/utility'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useSurveyAssessment} from '@services/assessmentHooks'
import {Step, Survey} from '@typedefs/surveys'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import ControlSelector from './ControlSelector'
import IntroInfo from './IntroInfo'
import LeftPanel from './LeftPanel'
import QuestionEdit from './QuestionEdit'
import QuestionList from './QuestionList'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type SurveyDesignOwnProps = {
  studyId?: string
}

type SurveyDesignProps = SurveyDesignOwnProps & RouteComponentProps

const SurveyDesign: FunctionComponent<SurveyDesignProps> = () => {
  let {id: guid} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  console.log('GOT ID!', guid)
  //@ts-ignore
  const {data: assessment, status} = useSurveyAssessment(
    guid === ':id' ? undefined : guid
  )
  const [survey, setSurvey] = React.useState<Survey>()
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >()

  React.useEffect(() => {
    if (assessment?.config) {
      setSurvey(assessment.config)
    }
  }, [assessment])

  const getQuestionList = (): Step[] => {
    //@ts-ignore
    return survey?.steps
      .filter(s => !!s)
      .map(s => ({
        identifier: s.identifier,
        title: s.title,
        type: s.type,
      }))
  }
  const addStep = (title: string) => {
    if (!survey) {
      return
    }
    const newStep: Step = {
      identifier: Utility.generateNonambiguousCode(6, 'ALPHANUMERIC'),
      title,
      type: 'unkonwn',
    }
    const currentStepId = survey?.steps.length
    setSurvey(prev => ({...prev!, steps: [...prev!.steps, newStep]}))
    setCurrentStepIndex(currentStepId)
  }

  const updateCurrentStep = (step: Step) => {
    if (!survey) {
      return
    }
    if (currentStepIndex) {
      let steps = [...survey!.steps]
      steps[currentStepIndex] = step
      setSurvey(prev => ({...prev!, steps}))
    }
  }

  const getCurrentStep = () =>
    currentStepIndex !== undefined ? survey?.steps[currentStepIndex] : undefined

  return (
    <Box border="1px solid black">
      {' '}
      SurveyDesign
      <pre>
        {survey && JSON.stringify(survey, null, 4)}
        Shell
      </pre>
      <Box bgcolor="#F8F8F8" px={5} display="flex">
        <LeftPanel>
          left
          {survey?.steps && (
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
          )}
        </LeftPanel>
        intro{currentStepIndex}
        {currentStepIndex === undefined ? (
          <>
            intro{currentStepIndex}
            <IntroInfo survey={assessment}></IntroInfo>
          </>
        ) : (
          <>
            hi
            <Box py={0} pr={3} pl={2}>
              <QuestionEdit
                onChange={step => updateCurrentStep(step)}
                step={getCurrentStep()}
              />
            </Box>
            <Box>
              <ControlSelector
                step={getCurrentStep()!}
                onChange={step => updateCurrentStep(step)}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
export default SurveyDesign
