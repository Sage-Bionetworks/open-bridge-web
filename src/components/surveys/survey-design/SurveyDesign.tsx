import Loader from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import {Alert, Box, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useUpdateSurveyAssessment,
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
  const {data: assessment, status} = useSurveyAssessment(
    isNewSurvey() ? undefined : guid
  )

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutate: mutateAssessment,
  } = useUpdateSurveyAssessment()

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

  const saveAssessment = async (
    asmnt: Assessment,
    action: 'UPDATE' | 'CREATE'
  ) => {
    setError('')

    mutateAssessment(
      {survey: asmnt, action},
      {
        onSuccess: info => {
          console.log('success')
          console.log(info)

          history.push(`/surveys/${info.guid}/design/title`)

          console.log('reloading')
        },
        onError: info => {
          setError((info as any).toString())
        },
      }
    )
  }

  return (
    <Loader reqStatusLoading={!isNewSurvey() && !survey}>
      <SurveyDesignContainerBox>
        <LeftPanel surveyId={guid}>
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
            <Route path={`/surveys/:id/design`}>
              <IntroInfo
                survey={assessment}
                onUpdate={saveAssessment}></IntroInfo>
            </Route>
          </Switch>
        </Box>
      </SurveyDesignContainerBox>
    </Loader>
  )
}
export default SurveyDesign
