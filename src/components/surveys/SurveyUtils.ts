import {ChoiceQuestionChoice, Step} from '@typedefs/surveys'

function reorder<Type>(steps: Type[], startIndex: number, endIndex?: number): Type[] {
  if (endIndex !== undefined) {
    const [removed] = steps.splice(startIndex, 1)
    steps.splice(endIndex, 0, removed)
  }
  return steps
}

function getNumberOfRegularSelectChoices(choices: ChoiceQuestionChoice[] | undefined): number {
  if (!choices) {
    return 0
  }
  return choices.filter(c => c.selectorType === undefined || c.selectorType === 'default').length
}

//get question next in the list
const getNextSequentialQuestion = (id: string, questions: Step[]) => {
  const qIndex = questions.findIndex(q => q.identifier === id)
  if (qIndex < 0 || qIndex === questions.length - 1) {
    return undefined
  }
  return questions[qIndex + 1]
}

//get question next in the list
const getSequentialQuestionIndex = (id: string, questions: Step[]) => {
  const qIndex = questions.findIndex(q => q.identifier === id)

  return {index: qIndex, isLast: qIndex === questions.length - 1}
}
//is this select choice 'select all' or 'select none'
const isSpecialSelectChoice = (choice: ChoiceQuestionChoice) => {
  return choice.selectorType === 'all' || choice.selectorType === 'exclusive'
}

const SurveyUtils = {
  reorder,
  getNumberOfRegularSelectChoices,
  getNextSequentialQuestion,
  getSequentialQuestionIndex,
  isSpecialSelectChoice,
}
export default SurveyUtils
