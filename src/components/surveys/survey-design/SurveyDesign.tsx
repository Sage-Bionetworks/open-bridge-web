import BannerInfo from '@components/studies/BannerInfo'
import AlertBanner from '@components/widgets/AlertBanner'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import {default as Utility, default as UtilityObject} from '@helpers/utility'
import {Box, CircularProgress, Dialog, styled} from '@mui/material'
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
import {useIsFetching, useIsMutating} from 'react-query'
import {Redirect, Route, RouteComponentProps, Switch, useHistory, useLocation, useParams} from 'react-router-dom'
// default styling

import NavigationPrompt from 'react-router-navigation-prompt'
import {SURVEY_ICONS} from '../widgets/SurveyIcon'
import IntroInfo from './IntroInfo'
import AddQuestionMenu from './left-panel/AddQuestionMenu'
import LeftPanel from './left-panel/LeftPanel'
import QUESTIONS, {QuestionTypeKey} from './left-panel/QuestionConfigs'
import QuestionEditPhone from './question-edit/QuestionEditPhone'
import QuestionEditRhs from './question-edit/QuestionEditRhs'
import QuestionEditToolbar from './question-edit/QuestionEditToolbar'
import ReadOnlyBanner from '@components/widgets/ReadOnlyBanner'

const SurveyDesignContainerBox = styled(Box, {
  label: 'SurveyDesignContainerBox',
})(({theme}) => ({
  position: 'relative',
  display: 'flex',
  // minHeight: 'calc(100vh - 70px)',
  backgroundColor: '#fbfbfc', //'#f8f8f8',
}))

const CentralContainer = styled('div', {label: 'PhoneContainer'})(({theme}) => ({
  textAlign: 'center',
  position: 'relative',
  height: '100%',
  flexGrow: 1,
  //backgroundColor: '#fff',
  padding: theme.spacing(0, 3, 0, 2),
}))

const RightContainer = styled('div', {label: 'RightContainer'})(({theme}) => ({
  height: '100%',
  backgroundColor: '#FFF', //'#f8f8f8',
}))

const AddQuestion = styled('div')(({theme}) => ({
  borderBottom: '1px solid #f2f2f2',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

function getQuestionIndexFromSearchString(search?: string): number | undefined {
  const qValue = new URLSearchParams(search)?.get('q')
  const qNum = parseInt(qValue || '')
  return isNaN(qNum) ? undefined : qNum
}

type SurveyDesignOwnProps = {}

type SurveyDesignProps = SurveyDesignOwnProps & RouteComponentProps

const ErrorBanner: React.FunctionComponent<{errors: (ExtendedError | null)[]}> = ({errors}) => {
  const [show, setShow] = React.useState<boolean>(false)
  React.useEffect(() => {
    setShow(errors.some(e => e !== null))
  }, [errors])
  return (
    <>
      {errors
        .filter(e => !!e)
        .map((e, i) => (
          <AlertBanner
            backgroundColor={BannerInfo.bannerMap.get('error')!.bgColor}
            textColor={BannerInfo.bannerMap.get('error')!.textColor}
            onClose={() => {
              setShow(false)
            }}
            isVisible={show}
            icon={BannerInfo.bannerMap.get('error')!.icon[0]}
            isSelfClosing={e!.statusCode !== 401}
            displayBottomOfPage={false}
            displayText={e!.statusCode === 401 ? <Redirect to={Utility.getRedirectLinkToOneSage()} /> : e!.message}
          />
        ))}
    </>
  )
}

const SaveIndicator: React.FunctionComponent<{
  numOfMutations: number
  hasObjectChanged?: boolean
}> = ({numOfMutations, hasObjectChanged}) => {
  const [loader, setLoader] = React.useState(numOfMutations)
  const [showChanged, setShowChanged] = React.useState(hasObjectChanged)
  React.useEffect(() => {
    setLoader(numOfMutations)
    if (numOfMutations === 0) {
      setShowChanged(false)
    }
  }, [numOfMutations])

  React.useEffect(() => {
    setShowChanged(hasObjectChanged)
  }, [hasObjectChanged])

  return (
    <Box
      sx={{
        position: 'absolute',
        width: '263px',
        height: '50px',
        left: 'calc(50% - 135px)',
        top: '10px',
        fontSize: '12px',
      }}>
      {loader > 0 ? <CircularProgress size={'30px'} /> : showChanged && <>Unsaved changes....</>}
    </Box>
  )
}

const SurveyDesign: FunctionComponent<SurveyDesignProps> = () => {
  let {id: surveyGuid} = useParams<{
    id: string
  }>()

  const isNewSurvey = () => surveyGuid === ':id'
  
  const history = useHistory()
  const location = useLocation()
  const [assessment, setAssessment] = React.useState<Assessment | undefined>()
  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const isReadOnly = assessment?.isReadOnly ?? false

  const [currentStepIndex, setCurrentStepIndex] = React.useState<number | undefined>(
    getQuestionIndexFromSearchString(location.search)
  )
  const numOfMutations = useIsMutating()
  const numOfFecheds = useIsFetching()

  //rq get and modify data hooks
  const {data: _assessment} = useSurveyAssessment(true, isNewSurvey() ? undefined : surveyGuid)
  const {data: _survey} = useSurveyConfig(isNewSurvey() ? undefined : surveyGuid)
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

  const {mutate: mutateAssessment, error: errorAssessmentUpdate} = useUpdateSurveyAssessment()
  const {mutate: mutateSurvey, error: errorSurveyUpdate} = useUpdateSurveyConfig()
  const {mutate: mutateResource, error: errorResourceUpdate} = useUpdateSurveyResource()
  const [debugOpen, setDebugOpen] = React.useState(false)

  //effects to populate local copies

  React.useEffect(() => {
    if (_assessment) {
      setAssessment(_assessment)
    }
  }, [_assessment])

  React.useEffect(() => {
    if (_survey) {
      setSurvey(_survey)
      setHasObjectChanged(false)
    }
  }, [_survey])

  React.useEffect(() => {
    setCurrentStepIndex(getQuestionIndexFromSearchString(location.search))
  }, [location])

  // fns used  to subcomponent callbacks

  const saveAssessmentFromIntro = (asmnt: Assessment, survey: Survey, action: 'UPDATE' | 'CREATE') => {
    mutateAssessment(
      {assessment: asmnt, action},
      {
        onSuccess: (assessment: Assessment) => {
          mutateSurvey(
            {guid: assessment.guid!, survey},
            {
              onSuccess: () => {
                if (action === 'CREATE') {
                  history.push(`/surveys/${assessment.guid}/design/question?q=0`)
                }
              },
            }
          )
        },
      }
    )
  }

  //saves current configuration and goes to a give step number
  // (doesn't wait for update to succeed)
  const navigateStep = (stepNum: number) => {
    if (hasObjectChanged) {
      mutateSurvey({guid: surveyGuid, survey: survey!})
    }
    //need a 'tick' for mutations to start
    setTimeout(() => history.push(`/surveys/${surveyGuid}/design/question?q=${stepNum}`), 100)
  }

  const updateCurrentStep = (step: Step, stepIndex?: number) => {
    if (!survey || isReadOnly) {
      return
    }

    const indexToUpdate = stepIndex ?? currentStepIndex
    if (indexToUpdate !== undefined) {
      let steps = [...survey!.config.steps]
      steps[indexToUpdate] = step
      setSurvey(prev => ({
        ...prev!,
        config: {
          ...survey!.config,
          steps,
        },
      }))
      const isOverviewStep = step.type === 'overview'
      if (!assessment) {
        throw new Error('no assessment')
      }
      if (isOverviewStep) {
        
        let updatedAssessment = assessment
        let hasAssessmentChanges = false

        const {image} = step
        if (image) {
          updatedAssessment.imageResource = {
            name: image.imageName,
            module: 'sage_survey',
            labels: [
              {
                lang: 'en',
                value: SURVEY_ICONS.get(image.imageName)?.title || 'Default',
              },
            ],
            type: 'ImageResource',
          }
          hasAssessmentChanges = true
        }

        if (hasAssessmentChanges) {
          setAssessment(updatedAssessment)
          mutateAssessment(
            {assessment: updatedAssessment, action: 'UPDATE'},
            {
              onSuccess: () => {
                setHasObjectChanged(true)
              },
              onError: error => {
                console.log(error)
              },
            }
          )
        }
      }
      setHasObjectChanged(true)
    }
  }

  const getCurrentStep = () => {
    const step = (currentStepIndex !== undefined) ? survey?.config.steps[currentStepIndex] : undefined
    if (step && step.type === 'choiceQuestion') {
      // If this is a choice question, then since both the text and the value can be independantly 
      // modified, we need to ensure that there is a "key" that is unique. If the step was created
      // without one (because the mobile devices do not require a guid) then add one.
      const choiceStep = step as ChoiceQuestion
      const choices = choiceStep.choices.map(choice => ({
        ...choice,
        guid: choice.guid ?? UtilityObject.generateNonambiguousCode(6, 'CONSONANTS'),
      }))
      const surveyRules = choiceStep.surveyRules?.map(rule => ({
        ...rule,
        choiceGuid: rule.choiceGuid ?? choices.find(choice => choice.value === rule.matchingAnswer)?.guid,
      })) 
      return {...step, choices, surveyRules}
    } 
    else {
      return step
    }
  }

  const updateAllStepsAndSave = (steps: Step[], fn?: () => void) => {
    const updatedSurvey = {
      ...survey,
      config: {
        ...survey!.config,
        steps,
      },
    }
    setSurvey(updatedSurvey)
    mutateSurvey({guid: surveyGuid, survey: updatedSurvey}, {onSuccess: fn})
  }

  const deleteCurrentStepAndSave = () => {
    let steps = [...survey!.config.steps]
    steps.splice(currentStepIndex!, 1)
    //if we only have one step left -- it is completion-- delete it as well
    if (steps.length === 1) {
      steps = []
    }
    updateAllStepsAndSave(steps, () => {
      setCurrentStepIndex(prev => prev! - 1)
    })
  }

  const addStepToTheEndAndSave = async (newStep: Step) => {
    const steps = survey!.config?.steps ? [...survey!.config?.steps] : []
    //since completion is always the last step -- push to l-2
    steps.splice(steps.length - 1, 0, newStep)
    const currentStepId = steps.length > 3 ? steps.length - 2 : 1

    updateAllStepsAndSave(steps, () => {
      setCurrentStepIndex(currentStepId)
      history.push(`/surveys/${surveyGuid}/design/question?q=${currentStepId}`)
    })
  }

  // adding the step from left menu
  const addStepWithDefaultConfig = (title: QuestionTypeKey) => {
    if (!survey) {
      return
    }
    const id = UtilityObject.generateNonambiguousCode(6, 'CONSONANTS')
    const q = QUESTIONS.get(title)
    if (q && q.default) {
      const newStep: Step = {...q.default} as Step
      newStep.identifier = `${newStep.identifier}_${id}`
      //if we are adding first step, also add completion
      addStepToTheEndAndSave(newStep)
    }
  }

  const duplicateCurrentStep = async () => {
    const newStep: Question = {...getCurrentStep()!}
    const id = UtilityObject.generateNonambiguousCode(6, 'CONSONANTS')
    const identifier = newStep.identifier.split('_')
    identifier[identifier.length - 1] = id
    newStep.identifier = identifier.join('_')
    addStepToTheEndAndSave(newStep)
  }

  const save = () => {
    mutateSurvey({guid: surveyGuid, survey: survey!})
  }

  //for display the line above the current question
  const getSurveyProgress = () => {
    if (!survey?.config.steps || currentStepIndex === undefined) {
      return 0
    }
    return (currentStepIndex + 1) / survey!.config.steps.length
  }

  //regular question -- not comletion or overview
  const isDynamicStep = () => {
    const step = getCurrentStep()
    return !!step && step.type !== 'completion' && step.type !== 'overview'
  }

  //determines if there are questions that hard link to the current question in the flow
  const findDependentQuestions = () => {
    const currentStep = getCurrentStep()
    if (!currentStep) {
      return []
    }

    const dependentSteps = survey!.config.steps.reduce((p, current, index) => {
      let q = current as ChoiceQuestion
      const hasQInSurveyRules =
        q.surveyRules && q.surveyRules.findIndex(sr => sr.skipToIdentifier === currentStep.identifier) !== -1
      const hasQAsNextStep = q.nextStepIdentifier === currentStep.identifier
      if (hasQInSurveyRules || hasQAsNextStep) {
        return [...p, index]
      }
      return [...p]
    }, [] as number[])

    return dependentSteps
  }

  
  return (
    <Loader reqStatusLoading={!isNewSurvey() && !survey}>
      <NavigationPrompt when={hasObjectChanged && !numOfMutations} key="nav_prompt">
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog isOpen={true} type={'NAVIGATE'} onCancel={onCancel} onConfirm={onConfirm} />
        )}
      </NavigationPrompt>
      {/* for debugging only <Button onClick={() => setDebugOpen(true)}>Open survey 2JSON</Button>*/}

      <ErrorBanner errors={[errorAssessmentUpdate, errorSurveyUpdate, errorResourceUpdate]} />

      { isReadOnly && <ReadOnlyBanner label='survey' /> }
      <SurveyDesignContainerBox>
        {/* LEFT PANEL*/}
        <LeftPanel
          onNavigateStep={navigateStep}
          surveyId={assessment?.identifier}
          currentStepIndex={currentStepIndex}
          guid={surveyGuid}
          surveyConfig={survey?.config}
          isReadOnly={isReadOnly}
          onReorderSteps={(steps: Step[]) => updateAllStepsAndSave(steps)}>
              { !isReadOnly &&
              <AddQuestion>
                <AddQuestionMenu onSelectQuestion={qType => addStepWithDefaultConfig(qType)} />
              </AddQuestion>
              }
        </LeftPanel>
        {/* CENTRAL PHONE AREA*/}

        <Box display="flex" flexGrow={1} justifyContent="space-between">
          <Switch>
            <Route path={`/surveys/:id/design/question`}>
              <CentralContainer>
                <SaveIndicator numOfMutations={numOfMutations + numOfFecheds} hasObjectChanged={hasObjectChanged} />
                {survey && (
                  <QuestionEditPhone
                    isReadOnly={isReadOnly}
                    isDynamic={isDynamicStep()}
                    globalSkipConfiguration={survey!.config.webConfig?.skipOption || 'CUSTOMIZE'}
                    onChange={(step: Step) => {
                      updateCurrentStep(step)
                    }}
                    step={getCurrentStep()}
                    completionProgress={getSurveyProgress()}
                  />
                )}
              </CentralContainer>
              <RightContainer>
                {survey && (
                  <QuestionEditRhs
                    isReadOnly={isReadOnly}
                    isDynamic={isDynamicStep()}
                    dependentQuestions={findDependentQuestions()}
                    step={getCurrentStep()!}
                    onChange={(step: Step) => updateCurrentStep(step)}>
                    {!isReadOnly && (
                      <QuestionEditToolbar
                        isDynamic={isDynamicStep()}
                        dependentQuestions={findDependentQuestions()}
                        onAction={action => {
                          if (action === 'save') {
                            save()
                          }
                          if (action === 'delete') {
                            deleteCurrentStepAndSave()
                          }
                          if (action === 'duplicate') {
                            duplicateCurrentStep()
                          }
                        }}
                      />
                    )}
                  </QuestionEditRhs>
                )}
              </RightContainer>
            </Route>

            <Route path={`/surveys/:id/design/intro`}>
              <IntroInfo surveyAssessment={assessment} survey={survey} onHasChanged={setHasObjectChanged} onUpdate={saveAssessmentFromIntro}>
                <SaveIndicator numOfMutations={numOfMutations} hasObjectChanged={hasObjectChanged} />
              </IntroInfo>
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
