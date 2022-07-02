import {ChoiceQuestionChoice} from '@typedefs/surveys'

function reorder<Type>(
  steps: Type[],
  startIndex: number,
  endIndex?: number
): Type[] {
  if (endIndex !== undefined) {
    const [removed] = steps.splice(startIndex, 1)
    steps.splice(endIndex, 0, removed)
  }
  return steps
}

function getNumberOfRegularQuestions(
  choices: ChoiceQuestionChoice[] | undefined
): number {
  if (!choices) {
    return 0
  }
  return choices.filter(
    c => c.selectorType === undefined || c.selectorType === 'default'
  ).length
}

const SurveyUtils = {
  reorder,
  getNumberOfRegularQuestions,
}
export default SurveyUtils
