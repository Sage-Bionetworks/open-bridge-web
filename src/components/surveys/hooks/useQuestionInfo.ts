import { ChoiceQuestion, Question, Step } from "@typedefs/surveys"
import React from "react"
import { QuestionTypeKey } from "../survey-design/left-panel/QuestionConfigs"
import SurveyUtils from "../SurveyUtils"

export type ExtendedStepInfo = { step: Step, stepType: QuestionTypeKey, index: number, isLast: boolean }

function getStepType(step: Step): QuestionTypeKey {
  if (step.type === 'instruction') {
    return 'INSTRUCTION'
  }
  if (step.type === 'choiceQuestion') {
    return (step as ChoiceQuestion).singleChoice
      ? 'SINGLE_SELECT'
      : 'MULTI_SELECT'
  }
  if (step.type === 'completion') {
    return 'COMPLETION'
  }
  if (step.type === 'overview') {
    return 'OVERVIEW'
  }
  const uiHint = (step as Question).uiHint
  const inputItemType = (step as Question).inputItem?.type

  switch (inputItemType) {
    case 'integer':
      switch (uiHint) {
        case 'likert':
          return 'LIKERT'
        case 'slider':
          return 'SLIDER'
        default:
          return 'NUMERIC'
      }

    case 'time':
      return 'TIME'
    case 'duration':
      return 'DURATION'
    case 'year':
      return 'YEAR'
    case 'string':
      return 'FREE_TEXT'
    default:
      return 'INSTRUCTION'
  }
}

const useQuestionInfo = (step: Step, steps: Step[]): ExtendedStepInfo => {

  const [extendedStep, setExtendedStep] = React.useState<ExtendedStepInfo>({ step, stepType: 'INSTRUCTION', index: 0, isLast: false })

  React.useEffect(() => {
    const stepType = getStepType(step)
    const { index, isLast } = SurveyUtils.getSequentialQuestionIndex(step.identifier, steps)
    setExtendedStep({ step, stepType, index, isLast })

  }, [step, steps])

  return extendedStep
}

export default useQuestionInfo
