import Loader from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import {Alert, Box, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useSurveyConfig,
  useUpdateSurveyAssessment,
  useUpdateSurveyConfig,
} from '@services/assessmentHooks'
import {Step, Survey} from '@typedefs/surveys'
import {Assessment} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useParams,
} from 'react-router-dom'
import ControlSelector from './ControlSelector'
import IntroInfo from './IntroInfo'
import LeftPanel from './LeftPanel'
import QuestionEdit from './QuestionEdit'
import QuestionList from './QuestionList'
import SurveyTitle from './SurveyTitle'

const SurveyDesignContainerBox = styled(Box)(({theme}) => ({
  backgroundColor: 'pink',
  display: 'flex',
  minHeight: 'calc(100vh - 64px)',
}))

type SurveyDesignOwnProps = {
  studyId?: string
}

type SurveyDesignProps = SurveyDesignOwnProps & RouteComponentProps

const SurveyDesign: FunctionComponent<SurveyDesignProps> = () => {
  let {id: guid} = useParams<{
    id: string
  }>()

  const history = useHistory()

  const isNewSurvey = () => guid === ':id'

  const [error, setError] = React.useState('')
  const {data: assessment, status: aStatus} = useSurveyAssessment(
    isNewSurvey() ? undefined : guid
  )
  const {data: survey, status: cStatus} = useSurveyConfig(
    isNewSurvey() ? undefined : guid
  )

  const {
    isSuccess: asmntUpdateSuccess,
    isError: asmntUpdateError,
    mutateAsync: mutateAssessment,
  } = useUpdateSurveyAssessment()

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutateAsync: mutateSurvey,
  } = useUpdateSurveyConfig()

  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >()

  const getQuestionList = (): Step[] => {
    //@ts-ignore
    return survey?.config.steps
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
    const currentStepId = survey?.config.steps.length
    //setSurvey(prev => ({...prev!, steps: [...prev!.steps, newStep]}))
    setCurrentStepIndex(currentStepId)
  }

  const updateCurrentStep = (step: Step) => {
    if (!survey) {
      return
    }
    if (currentStepIndex) {
      let steps = [...survey!.config.steps]
      steps[currentStepIndex] = step
      // setSurvey(prev => ({...prev!, steps}))
    }
  }

  const getCurrentStep = () =>
    currentStepIndex !== undefined
      ? survey?.config.steps[currentStepIndex]
      : undefined

  const saveAssessment = async (
    asmnt: Assessment,
    survey: Survey,
    action: 'UPDATE' | 'CREATE'
  ) => {
    setError('')
    try {
      const result = await mutateAssessment({assessment: asmnt, action})
      await mutateSurvey({guid: result.guid!, survey})

      console.log('success')
      console.log(result)
      history.push(`/surveys/${result.guid}/design/title`)
      console.log('reloading')
    } catch (error) {
      setError((error as any).toString())
    }
  }

  return (
    <Loader reqStatusLoading={!isNewSurvey() && !survey}>
      <SurveyDesignContainerBox>
        <LeftPanel surveyId={guid}>
          left
          {survey?.config.steps && (
            <QuestionList
              currentStepIndex={currentStepIndex}
              steps={getQuestionList()}
              onAdd={(title: string) => addStep(title)}
              onNavigate={(identifier: string) => {
                setCurrentStepIndex(
                  survey.config.steps.findIndex(s => s.identifier == identifier)
                )
              }}
            />
          )}
        </LeftPanel>
        <Box display="flex" flexGrow={1}>
          {error && <Alert color="error">{error}</Alert>}
          <Switch>
            <Route path={`/surveys/:id/design/title`}>
              <SurveyTitle />
            </Route>
            <Route path={`/surveys/:id/design/question`}>
              <div>
                {' '}
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
              </div>
            </Route>

            <Route path={`/surveys/:id/design/completion`}>
              <div>!!!completion</div>
            </Route>
            <Route path="">
              <IntroInfo
                surveyAssessment={assessment}
                survey={survey}
                onUpdate={saveAssessment}></IntroInfo>
            </Route>
          </Switch>
        </Box>
      </SurveyDesignContainerBox>
    </Loader>
  )
}
export default SurveyDesign
