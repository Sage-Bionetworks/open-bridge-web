import UtilityObject from '@helpers/utility'
import {Box, styled} from '@mui/material'
import {latoFont} from '@style/theme'
import {ChoiceQuestion, Question, Step} from '@typedefs/surveys'
import {Edge, MarkerType, Node} from 'reactflow'
import QUESTIONS, {getQuestionId} from '../survey-design/left-panel/QuestionConfigs'
import {DivContainer} from '../survey-design/left-panel/QuestionTypeDisplay'

const position = {x: 0, y: 0}

const StyledQuestionTitle = styled('div', {
  label: 'StyledQuestionTitle',
  shouldForwardProp: prop => prop !== 'unconnected',
})<{
  unconnected?: boolean
}>(({theme, unconnected}) => ({
  '&.title': {
    fontSize: '12px',
    position: 'absolute',
    left: 0,
    top: '60px',
    width: '90px',
    lineHeight: '15px',
    backgroundColor: '#fcfcfc',
    fontFamily: latoFont,

    textAlign: 'left',
    color: unconnected ? 'red' : 'black',
  },
}))

function createNode(
  q: Step,
  qSequentialIndex: number,

  isUnconnected: boolean
): Node {
  const label = (
    <div style={{position: 'relative'}}>
      <DivContainer>
        {QUESTIONS.get(getQuestionId(q))?.img}
        {q.type !== 'completion' && q.type !== 'overview' && <Box>{qSequentialIndex}</Box>}
        <StyledQuestionTitle className="title" unconnected={isUnconnected}>
          {q.title}
        </StyledQuestionTitle>
      </DivContainer>
    </div>
  )

  return {
    id: q.identifier,
    data: {label: label},
    position,
  }
}

function createEdge(i1: string, i2: string, isDisconnected?: boolean): Edge {
  return {
    id: i1 + '-' + i2,
    source: i1,
    target: i2,
    type: 'smoothstep',
    animated: !!isDisconnected,

    style: {stroke: isDisconnected ? 'red' : 'black'},
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: !!isDisconnected ? 'red' : 'black',
    },
  }
}

function getChildNodes(questions: (ChoiceQuestion | Step)[], q: ChoiceQuestion | Step) {
  let nextQs: (ChoiceQuestion | Step)[] = []
  const choices = (q as ChoiceQuestion).choices
  const surveyRules = (q as ChoiceQuestion).surveyRules
  const nextStepIdentifier = (q as Question).nextStepIdentifier
  const qChoiceValues = choices?.map(c => c.value) || []

  if (surveyRules?.length) {
    //only use the rules that map to the choices the question has,
    // find ids we are going to next/create a set to remove dups
    //only included rules that have matchingAnswer
    const nextIds = [
      ...new Set(
        surveyRules
          .filter(rule => rule.matchingAnswer && qChoiceValues.includes(rule.matchingAnswer))
          .map(rule => rule.skipToIdentifier)
      ),
    ]
    //find questions correcponding to those ids
    nextQs = questions.filter(q1 => nextIds.includes(q1.identifier))

    const qOptions = choices.map(c => c.value).filter(v => v !== undefined)
    const ruleValues = surveyRules.map(rule => rule.matchingAnswer)
    //if we have rule for all choices we will skipp next identifier
    if (UtilityObject.areArraysEqual(qOptions, ruleValues)) {
      return nextQs
    }
  }

  //either use next step identifier or next step in array
  if (nextStepIdentifier) {
    const next = questions.find(q1 => q1.identifier === nextStepIdentifier)
    if (next) {
      nextQs.push(next)
    }
  } else {
    const qIndex = questions.findIndex(q1 => q1.identifier === q.identifier)
    if (qIndex < questions.length - 1 && qIndex !== -1) {
      nextQs.push(questions[qIndex + 1])
    }
  }
  return nextQs
}

const getNodes = (questions: (ChoiceQuestion | Step)[]) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let error: Error | undefined = undefined

  function addNode(q: ChoiceQuestion | Step, index: number, error: Error | undefined) {
    const node = createNode(q, index, false)
    nodes.push(node)
    let nextQs = getChildNodes(questions, q)

    if (nextQs.length) {
      //add child edges
      for (let child of nextQs) {
        //find sequential index of the quesiton
        const qIndex = questions.findIndex(q1 => q1.identifier === child.identifier)

        //add child node
        const indexOfNode = nodes.findIndex(q1 => q1.id === child.identifier)

        if (indexOfNode === -1) {
          addNode(child, qIndex, error)
        }
        //add edge
        const indexOfEdge = edges.findIndex(e => e.source === q.identifier && e.target === child.identifier)
        if (indexOfEdge === -1) {
          const edge = createEdge(q.identifier, child.identifier)
          edges.push(edge)
        }
      }
    }
  }

  addNode(questions[0], 0, undefined)

  //get nodes that don't have connections
  const nodeIds = nodes.map(n => n.id)

  const disconnectedQs = questions.filter(q => !nodeIds.includes(q.identifier))

  disconnectedQs.forEach((dq, i) => {
    const qIndex = questions.findIndex(q1 => q1.identifier === dq.identifier)
    const node = createNode(dq, qIndex, true)
    nodes.push(node)

    let nextQs = getChildNodes(questions, dq)
    if (nextQs.length) {
      //add child edges
      for (let child of nextQs) {
        const edge = createEdge(dq.identifier, child.identifier, true)
        if (edges.findIndex(e => e.id === edge.id) === -1) {
          edges.push(edge)
        }
      }
    }
  })

  return {nodes, edges, error}
}

//function detect cycles in a graph using DFS
export const detectCycle = (edges: Edge[]): boolean => {
  const visited: Edge[] = []
  const stack: Edge[] = []

  //recursive function that checks if there is a cycle in the graph
  function isCyclicUtil(edge: Edge, visited: Edge[], stack: Edge[]): boolean {
    if (stack.includes(edge)) {
      return true
    }

    if (visited.includes(edge)) {
      return false
    }

    visited.push(edge)
    stack.push(edge)

    const children = edges.filter(e => e.source === edge.target)

    for (var child of children) {
      if (isCyclicUtil(child, visited, stack)) {
        return true
      }
    }

    stack.pop()
    return false
  } //end of function

  for (var edge of edges) {
    if (visited.includes(edge)) {
      continue

      //if not visited, then call recursive function
    } else if (isCyclicUtil(edge, visited, stack)) {
      return true
    }
  }
  return false
}

export const getEdgesFromSteps = (questions: ChoiceQuestion[] | Step[]) => {
  const edges: Edge[] = []
  let error: Error | undefined = undefined

  function addEdge(q: Step | ChoiceQuestion, error: Error | undefined) {
    let nextEdges = getChildNodes(questions, q)

    //add it if it hasn't been added, otherwise just add edge
    nextEdges.forEach((child, index) => {
      const edge = createEdge(q.identifier, child.identifier)
      if (edges.findIndex(e => e.id === edge.id) === -1) {
        edges.push(edge)
        addEdge(child, error)
      }
    })
  }

  addEdge(questions[0], undefined)

  return {edges, error}
}

export default getNodes
