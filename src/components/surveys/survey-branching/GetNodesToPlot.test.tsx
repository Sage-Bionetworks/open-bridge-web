//unit tests for BranchingConfig.tsx
import {ChoiceQuestion} from '@typedefs/surveys'
import SurveyQuestions from '__test_utils/mocks/surveyQuestions'
import getNodes, {detectCycle} from './GetNodesToPlot'

test('should create nodes for all the questions', () => {
  const {nodes, edges} = getNodes(SurveyQuestions)
  const questionIds = SurveyQuestions.map(q => q.identifier).sort()
  const sortedNodeIds = nodes.map(n => n.id).sort()

  expect(questionIds).toEqual(sortedNodeIds)
})

test('should create edges for selection rules', () => {
  const {nodes, edges} = getNodes(SurveyQuestions)
  const choiceQ = SurveyQuestions.find(q => q.identifier === 'choiceQ1') as ChoiceQuestion
  const choiceQRules = choiceQ.surveyRules

  const choiceQEdges = edges.filter(e => e.source === 'choiceQ1')
  expect(choiceQEdges.length).toEqual(choiceQRules!.length)
  // const sortedNodeIds = nodes.map(n => n.id).sort()
  // console.log(pizzaEdges)
  // expect(questionIds).toEqual(sortedNodeIds)
})

test('should create edge for nextStepIdentifier', () => {
  let choiceQ = SurveyQuestions.find(q => q.identifier === 'choiceQ1') as ChoiceQuestion

  choiceQ = {...choiceQ, nextStepIdentifier: 'pizza', surveyRules: choiceQ.surveyRules!.slice(0, 3)}

  const updatedSurveyQuestions = SurveyQuestions.map(q => (q.identifier === 'choiceQ1' ? choiceQ : q))
  const {nodes, edges} = getNodes(updatedSurveyQuestions)
  choiceQ = updatedSurveyQuestions.find(q => q.identifier === 'choiceQ1') as ChoiceQuestion
  const choiceQRules = choiceQ.surveyRules!

  const choiceQEdges = edges.filter(e => e.source === 'choiceQ1')
  expect(choiceQEdges.length).toEqual(choiceQRules.length + 1)
})

test('should NOT create edge for nextStepIdentifier if there are rules for each choice', () => {
  let choiceQ = SurveyQuestions.find(q => q.identifier === 'choiceQ1') as ChoiceQuestion

  choiceQ = {...choiceQ, nextStepIdentifier: 'pizza'}

  const updatedSurveyQuestions = SurveyQuestions.map(q => (q.identifier === 'choiceQ1' ? choiceQ : q))
  const {nodes, edges} = getNodes(updatedSurveyQuestions)
  choiceQ = updatedSurveyQuestions.find(q => q.identifier === 'choiceQ1') as ChoiceQuestion
  const choiceQRules = choiceQ.surveyRules!

  const choiceQEdges = edges.filter(e => e.source === 'choiceQ1')
  expect(choiceQEdges.length).toEqual(choiceQRules.length)
})

test('should detect cycle', () => {
  let edges = getNodes(SurveyQuestions).edges
  var hasCycle = detectCycle(edges)
  expect(hasCycle).toBe(false)

  //introduce cycle
  const QuestionsWithCycle = SurveyQuestions.map(q =>
    q.identifier === 'simpleQ1' ? {...q, nextStepIdentifier: 'choiceQ1'} : q
  )

  edges = getNodes(QuestionsWithCycle).edges
  hasCycle = detectCycle(edges)
  expect(hasCycle).toBe(true)
})

test('should detect unconnected edges', () => {
  let edges = getNodes(SurveyQuestions).edges
  let edgeColors = edges.map(e => e.style!.stroke)
  expect(edgeColors.find(c => c === 'red')).toBeUndefined()

  //introduce disconnectedNode
  const QuestionsWithCycle = SurveyQuestions.map(q =>
    q.identifier === 'overview' ? {...q, nextStepIdentifier: 'simpleQ1'} : q
  )

  edges = getNodes(QuestionsWithCycle).edges
  edgeColors = edges.map(e => e.style!.stroke)
  expect(edgeColors.find(c => c === 'red')).not.toBeUndefined()
})
