import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import UtilityObject from '@helpers/utility'
import {Alert, Box, Button, Dialog, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useSurveyConfig,
  useUpdateSurveyAssessment,
  useUpdateSurveyConfig,
  useUpdateSurveyResource,
} from '@services/assessmentHooks'
import {ChoiceQuestion, Question, Step, Survey} from '@typedefs/surveys'
import {Assessment, ExtendedError} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useIsMutating} from 'react-query'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom'
import NavigationPrompt from 'react-router-navigation-prompt'
import IntroInfo from './IntroInfo'
import AddQuestionMenu from './left-panel/AddQuestionMenu'
import LeftPanel from './left-panel/LeftPanel'
import QUESTIONS, {QuestionTypeKey} from './left-panel/QuestionConfigs'
import QuestionEditPhone from './question-edit/QuestionEditPhone'
import QuestionEditRhs from './question-edit/QuestionEditRhs'
import QuestionEditToolbar from './question-edit/QuestionEditToolbar'

const SurveyDesignContainerBox = styled(Box)(({theme}) => ({
  position: 'relative',
  backgroundColor: 'pink',
  display: 'flex',

  minHeight: 'calc(100vh - 70px)',
}))

const AddQuestion = styled('div')(({theme}) => ({
  borderTop: '1px solid #f2f2f2',
  display: 'flex',
}))

type SurveyDesignOwnProps = {}

type SurveyDesignProps = SurveyDesignOwnProps & RouteComponentProps

const SurveyDesign: FunctionComponent<SurveyDesignProps> = () => {
  let {id: surveyGuid} = useParams<{
    id: string
  }>()

  const getQuestionIndexFromSearchString = (): //  search: string

  number | undefined => {
    const qValue = new URLSearchParams(location.search)?.get('q')
    const qNum = parseInt(qValue || '')
    return isNaN(qNum) ? undefined : qNum
  }

  const isNewSurvey = () => surveyGuid === ':id'

  const history = useHistory()
  const location = useLocation()
  const [assessment, setAssessment] = React.useState<Assessment | undefined>()
  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >(getQuestionIndexFromSearchString())
  const isSaving = useIsMutating()

  //rq get and modify data hooks
  const {data: _assessment, status: aStatus} = useSurveyAssessment(
    true,
    isNewSurvey() ? undefined : surveyGuid
  )
  const {data: _survey, status: cStatus} = useSurveyConfig(
    isNewSurvey() ? undefined : surveyGuid
  )
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

  const {
    isSuccess: asmntUpdateSuccess,
    isError: asmntUpdateError,
    mutateAsync: mutateAssessment,
    status,
  } = useUpdateSurveyAssessment()

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutateAsync: mutateSurvey,
  } = useUpdateSurveyConfig()

  const {
    isSuccess: resourceUpdateSuccess,
    isError: resourceUpdateError,
    mutateAsync: mutateResource,
  } = useUpdateSurveyResource()

  const [debugOpen, setDebugOpen] = React.useState(false)

  //effects to populate local copies

  React.useEffect(() => {
    if (_assessment) {
      setAssessment(_assessment)
    }
  }, [_assessment])

  React.useEffect(() => {
    if (_survey) {
      console.log('%c surveyChanged', 'background: #222; color: #bada55')
      setSurvey(_survey)
      setHasObjectChanged(false)
    }
  }, [_survey])

  /*  useDeepCompareEffect(() => {
    if (survey && !hasObjectChanged && survey !== _survey) {
      setHasObjectChanged(true)
    }
  }, [survey || {}, _survey || {}])*/

  React.useEffect(() => {
    console.log('location change')
    setCurrentStepIndex(getQuestionIndexFromSearchString())
  }, [location])

  /*React.useEffect(() => {
    let qIndex = new URLSearchParams(useLocation().search)?.get('q')

    setCurrentStepIndex(qIndex ? parseInt(qIndex) : undefined)
    console.log('changing index')
  }, [])
*/
  // fns used  to subcomponent callbackss
  const saveIconResource = async () => {
    if (assessment) {
      const r = assessment.resources?.find(r => r.category === 'icon')
      if (!r) {
        throw new Error('no resource')
      }
      return mutateResource({assessment, resource: r})
    }
  }

  const saveAssessment = async (
    asmnt: Assessment,
    survey: Survey,
    action: 'UPDATE' | 'CREATE'
  ) => {
    setError(undefined)
    try {
      const result = await mutateAssessment({assessment: asmnt, action})
      await mutateSurvey({guid: result.guid!, survey})

      console.log('success')
      console.log(result)

      history.push(`/surveys/${result.guid}/design/question?q=0`)
      console.log('reloading')
    } catch (error) {
      setError((error as ExtendedError).message.toString())
    }
  }

  const reorderOrAddSteps = async (steps: Step[]) => {
    console.log('updating steps', steps)
    const updatedSurvey = {
      ...survey,
      config: {
        ...survey!.config,
        steps,
      },
    }
    setSurvey(updatedSurvey)

    await mutateSurvey({guid: surveyGuid, survey: updatedSurvey})
  }

  const navigateStep = async (id: number, shouldSave = true) => {
    console.log('type of id' + typeof id)
    try {
      console.log('about to update survey')
      if (shouldSave) {
        //  await mutateSurvey({guid: surveyGuid, survey: survey!})
      }
      if (typeof id === 'number') {
        console.log('redirecting')

        history.push(`/surveys/${surveyGuid}/design/question?q=${id}`)
        console.log('survey: ', survey?.config.steps)
      }
    } catch (e) {
      alert(e)
    }
  }

  const addStepToTheEnd = async (newStep: Step) => {
    const steps = survey!.config?.steps ? [...survey!.config?.steps] : []

    //since completion is always the last step -- push to l-2
    steps.splice(steps.length - 1, 0, newStep)
    await reorderOrAddSteps(steps)

    const currentStepId = steps.length > 3 ? steps.length - 2 : 1
    console.log('wantto set current step')
    setCurrentStepIndex(currentStepId)
    console.log('surveysteps' + survey!.config.steps)
    navigateStep(currentStepId, false)
  }

  // adding the step from left menu
  const addStepWithDefaultConfig = async (title: QuestionTypeKey) => {
    if (!survey) {
      return
    }

    //const isFirstStep =
    //   (survey.config.steps || []).filter(s => s.type !== 'overview').length ===
    //   0
    const id = UtilityObject.generateNonambiguousCode(6, 'CONSONANTS')
    const q = QUESTIONS.get(title)
    if (q && q.default) {
      const newStep: Step = {...q.default} as Step
      newStep.identifier = `${newStep.identifier}_${id}`

      //if we are adding first step, also add completion
      await addStepToTheEnd(newStep)
    }
  }

  const updateCurrentStep = (step: Step, stepIndex?: number) => {
    if (!survey) {
      return
    }
    const indexToUpdate = stepIndex ?? currentStepIndex
    if (indexToUpdate !== undefined) {
      console.log('updating step to ', step)
      let steps = [...survey!.config.steps]
      steps[indexToUpdate] = step
      setSurvey(prev => ({
        ...prev!,
        config: {
          ...survey!.config,
          steps,
        },
      }))
      setHasObjectChanged(true)
    }
  }

  const findDependentQuestions = () => {
    const currentStep = getCurrentStep()
    if (!currentStep) {
      return []
    }

    const dependentSteps = survey!.config.steps.reduce((p, current, index) => {
      let q = current as ChoiceQuestion

      if (
        q.surveyRules &&
        q.surveyRules.findIndex(
          sr => sr.skipToIdentifier === currentStep.identifier
        ) !== -1
      ) {
        return [...p, index]
      }
      return [...p]
    }, [] as number[])

    return dependentSteps
  }

  const getCurrentStep = () =>
    currentStepIndex !== undefined
      ? survey?.config.steps[currentStepIndex]
      : undefined

  const duplicateCurrentStep = async () => {
    const newStep: Question = {...getCurrentStep()!}
    const id = UtilityObject.generateNonambiguousCode(6, 'CONSONANTS')
    const identifier = newStep.identifier.split('_')
    identifier[identifier.length - 1] = id
    newStep.identifier = identifier.join('_')
    addStepToTheEnd(newStep)
  }

  const save = async () => {
    console.log('!!!saving', survey)

    await mutateSurvey({guid: surveyGuid, survey: survey!})
    console.log('done')
  }
  const deleteCurrentStep = async () => {
    let steps = [...survey!.config.steps]
    steps.splice(currentStepIndex!, 1)
    //if we only have one step left -- it is completion-- delete it as well
    if (steps.length === 1) {
      steps = []
    }
    await mutateSurvey({
      guid: surveyGuid,
      survey: {
        ...survey,
        config: {
          ...survey!.config,
          steps,
        },
      },
    })
  }

  const getSurveyProgress = () => {
    if (!survey?.config.steps || currentStepIndex === undefined) {
      return 0
    }

    return (currentStepIndex + 1) / survey!.config.steps.length
  }

  const isDynamicStep = () => {
    const step = getCurrentStep()
    return !!step && step.type !== 'completion' && step.type !== 'overview'
  }

  return (
    <Loader reqStatusLoading={!isNewSurvey() && !survey}>
      <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>
      <Button onClick={() => setDebugOpen(true)}>Open survey 2JSON</Button>
      <SurveyDesignContainerBox>
        {/* LEFT PANEL*/}
        <LeftPanel
          onNavigateStep={navigateStep}
          surveyId={assessment?.identifier}
          currentStepIndex={currentStepIndex}
          guid={surveyGuid}
          surveyConfig={survey?.config}
          onUpdateSteps={(steps: Step[]) => reorderOrAddSteps(steps)}>
          <AddQuestion>
            <AddQuestionMenu
              onSelectQuestion={qType => addStepWithDefaultConfig(qType)}
            />
          </AddQuestion>
        </LeftPanel>
        {/* CEDNTRAL PHONE AREA*/}

        <Box display="flex" flexGrow={1} justifyContent="space-between">
          {error && <Alert color="error">{error}</Alert>}

          <Switch>
            <Route path={`/surveys/:id/design/question`}>
              <Box
                py={0}
                pr={3}
                pl={2}
                textAlign="center"
                height="100%"
                flexGrow="1"
                bgcolor={'#fff'}>
                {hasObjectChanged && <span>Unsaved changes*</span>}
                {isSaving > 0 && <span>Saving</span>}

                {survey && (
                  <QuestionEditPhone
                    isDynamic={isDynamicStep()}
                    globalSkipConfiguration={
                      survey!.config.webConfig!.skipOption!
                    }
                    onChange={(step: Step) => {
                      updateCurrentStep(step)
                    }}
                    step={getCurrentStep()}
                    completionProgress={getSurveyProgress()}
                  />
                )}
              </Box>
              <Box height="100%" bgcolor={'#f8f8f8'}>
                {survey && (
                  <QuestionEditRhs
                    isDynamic={isDynamicStep()}
                    dependentQuestions={findDependentQuestions()}
                    step={getCurrentStep()!}
                    onChange={(step: Step) => updateCurrentStep(step)}>
                    <QuestionEditToolbar
                      isDynamic={isDynamicStep()}
                      dependentQuestions={findDependentQuestions()}
                      onAction={action => {
                        console.log(action)
                        if (action === 'save') {
                          save()
                        }
                        if (action === 'delete') {
                          deleteCurrentStep()
                        }
                        if (action === 'duplicate') {
                          duplicateCurrentStep()
                        }
                      }}
                    />
                  </QuestionEditRhs>
                )}
              </Box>
            </Route>

            <Route path={`/surveys/:id/design/intro`}>
              <IntroInfo
                surveyAssessment={assessment}
                survey={survey}
                onUpdate={saveAssessment}></IntroInfo>
            </Route>
            <Route path="">
              <Redirect to={`/surveys/${surveyGuid}/design/intro`}></Redirect>
            </Route>
          </Switch>
        </Box>
      </SurveyDesignContainerBox>
      <Dialog open={debugOpen} onClose={() => setDebugOpen(false)}>
        <pre>{JSON.stringify(survey?.config, null, 2)}</pre>
      </Dialog>
    </Loader>
  )
}
export default SurveyDesign
