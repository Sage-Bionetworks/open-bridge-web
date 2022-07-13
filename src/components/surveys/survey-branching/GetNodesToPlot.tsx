import UtilityObject from '@helpers/utility'
import {ChoiceQuestion, Step} from '@typedefs/surveys'
import {Edge, MarkerType, Node, Position} from 'react-flow-renderer'
import QUESTIONS, {
  getQuestionId,
} from '../survey-design/left-panel/QuestionConfigs'
import {DivContainer} from '../survey-design/left-panel/QuestionTypeDisplay'

const HWIDTH = 120
const HHEIGHT = 100
const PADDING_X = 20

function createNode(
  q: Step,
  qSequentialIndex: number,
  xCoord: number,
  yCoord: number,
  isUnconnected: boolean,
  isFirstInRow: boolean,
  isLastInRow: boolean
): Node {
  const label = (
    <div style={{position: 'relative'}}>
      <DivContainer>
        {QUESTIONS.get(getQuestionId(q))?.img}
        <div style={{fontSize: '12px'}}>{qSequentialIndex + 1}</div>
        <div
          style={{
            fontSize: '12px',
            position: 'absolute',
            left: 0,
            top: '60px',
            width: '90px',
            lineHeight: '15px',
            backgroundColor: '#fcfcfc',

            textAlign: 'left',
            color: isUnconnected ? 'red' : 'black',
          }}>
          {q.title}
        </div>
      </DivContainer>
    </div>
  )

  return {
    id: q.identifier,
    data: {label: label},
    position: {x: xCoord, y: yCoord},
    sourcePosition: isLastInRow ? Position.Bottom : Position.Right,
    targetPosition: isFirstInRow ? Position.Top : Position.Left,
  }
}

function createEdge(i1: string, i2: string, isLastInRow?: boolean) {
  return {
    id: i1 + '-' + i2,
    source: i1,
    target: i2,
    type: 'default', // isLastInRow ? 'smart' : 'default',
    markerEnd: {type: MarkerType.ArrowClosed, color: '#000'},
  }
}

function getCoordiatesForNextNode(
  plotWidth: number,
  x: number,
  y: number,
  childNumber: number,
  totalChildren: number,
  id: string
) {
  const getChildOffset = () => {
    //odd number of children
    if (totalChildren % 2 === 1) {
      const middleNode = Math.floor(totalChildren / 2)
      if (childNumber === middleNode) {
        return 0
      } else {
        return (middleNode - childNumber) * HHEIGHT
      }
    }
    // even
    else {
      //   console.log('%cEVEN', 'background: #222; color: rgb(218, 85, 105)')
      //  middle node = 1
      // mode ): 2
      //if child node <
      const middleNode = (totalChildren - 1) / 2
      const y = middleNode - childNumber * HHEIGHT
      // const y = (middleNode - (childNumber + 1)) * HHEIGHT

      return Math.round(y)
    }
  }

  const newHeight = y + getChildOffset()
  //console.log('yOffset for ' + id + ' ' + yOffset)

  const nextRow = x + HWIDTH + 80 > plotWidth
  const lastInRow = !nextRow && x + HWIDTH * 2 + 80 > plotWidth

  const cx = nextRow ? PADDING_X : x + HWIDTH
  const cy = nextRow ? HHEIGHT + 100 + newHeight : newHeight
  // console.log('cy ', cy)
  return {x: cx, y: cy, nextRow: nextRow, lastInRow: lastInRow}
}

function getCoordiatesForNextDisconnectedNode(
  index: number,
  plotWidth: number,

  id: string
) {
  const rows = index === 0 ? 1 : Math.ceil((HWIDTH * index) / plotWidth)

  const isPerRow = Math.ceil((plotWidth - 20) / HWIDTH)
  const newI = index % isPerRow

  const cx = rows > 1 ? HWIDTH * newI : index * HWIDTH
  const cy = rows * HHEIGHT
  //console.log('cy ', cy)
  return {x: cx, y: cy}
}

function getChildNodes(questions: ChoiceQuestion[], q: ChoiceQuestion) {
  let nextQs: ChoiceQuestion[] = []
  //if surveyRules
  if (q.surveyRules) {
    //find ids we are going to next/create a set to remove dups
    const nextIds = [
      ...new Set(q.surveyRules.map(rule => rule.skipToIdentifier)),
    ]
    //find questions correcponding to those ids
    nextQs = questions.filter(q1 => nextIds.includes(q1.identifier))

    const qOptions = q.choices.map(c => c.value).filter(v => v !== undefined)
    const ruleValues = q.surveyRules.map(rule => rule.matchingAnswer)
    if (UtilityObject.areArraysEqual(qOptions, ruleValues)) {
      return nextQs
    }
  }

  //either use next step identifier or next step in lince
  if (q.nextStepIdentifier) {
    const next = questions.find(q1 => q1.identifier === q.nextStepIdentifier)
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

const getNodes = (questions: ChoiceQuestion[], plotWidth: number) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let error: Error | undefined = undefined

  function addNode(
    q: ChoiceQuestion,
    index: number,
    x: number,
    y: number,
    isFirstInRow: boolean,
    isLastInRow: boolean,
    runNumber: number,
    error: Error | undefined
  ) {
    //  console.log('node', q, index)
    const node = createNode(q, index, x, y, false, isFirstInRow, isLastInRow)
    nodes.push(node)
    let nextQs = getChildNodes(questions, q)

    if (nextQs.length) {
      //add it if it hasn't been added, otherwise just add edge

      var i = 0
      for (var child of nextQs) {
        //find sequential index of the quesiton
        const qIndex = questions.findIndex(
          q1 => q1.identifier === child.identifier
        )

        const uniqs = new Set(nextQs.map(q => q.identifier))
        const result = getCoordiatesForNextNode(
          plotWidth,
          x,
          y,
          i,
          uniqs.size,
          child.identifier
        )
        const edge = createEdge(
          q.identifier,
          child.identifier,
          result.lastInRow
        )
        // console.log('adding edge', edge, nextQs.length)
        if (edges.findIndex(e => e.id === edge.id) === -1) {
          edges.push(edge)
        }

        i++
        //
        if (runNumber > questions.length * 5) {
          error = new Error('Overflow')

          //stack overflow
          //  alert('Stack overflow, Please refresh the page')
        } else {
          const indexOfNode = nodes.findIndex(q1 => q1.id === child.identifier)

          if (indexOfNode === -1) {
            addNode(
              child,
              qIndex,
              result.x,
              result.y,
              result.nextRow,
              result.lastInRow,
              ++runNumber,
              error
            )
            //  console.log('adding node', child.identifier)
          } else {
            if (result.x > nodes[indexOfNode].position.x) {
              // nodes[indexOfNode].position.x = result.x
            }
            /*  if (result.y > nodes[indexOfNode].position.y) {*/
            //  nodes[indexOfNode].position.y = result.y
            /* }*/
            // nodes[indexOfNode].position.y = result.y
          }
          //    } else {
          //    console.log('skipping node', child.identifier)
          //  }
        }
      }
    }
  }

  addNode(questions[0], 0, 20, 20, false, false, 0, undefined)

  edges.forEach(e => {
    const source = e.source
    //find all of the childeren of that node
    const sourceNode = nodes.find(n => n.id === source)
    console.log(sourceNode?.position.y)
    const childEdges = edges.filter(e => e.source === source).map(e => e.target)
    const childNodes = nodes.filter(
      n =>
        childEdges.includes(n.id) &&
        Math.abs(n.position.y - (sourceNode?.position.y || 0)) < 10
    )
    if (childNodes.length > 1) {
      console.log(
        'CHILD NODE of  ' + source + 'y=' + sourceNode?.position.y,
        childNodes.map(n => n.position.y).join(',')
      )
      childNodes.forEach((childNode, index) => {
        //for each child
        const nToUpdate = nodes.findIndex(n => n.id === childNode.id)
        const coords = getCoordiatesForNextNode(
          plotWidth,
          0,

          sourceNode?.position.y || 0,
          index,
          childNodes.length,
          'some'
        )
        console.log('UPDATING', coords.y)
        nodes[nToUpdate].position.y = coords.y
      })
    }
  })
  //adjust y positions
  const minY = Math.min(...nodes.map(n => n.position.y))

  if (minY < 20) {
    nodes.forEach(n => (n.position.y = n.position.y + Math.abs(minY) + 20))
  }

  //get nodes that don't have connections
  const nodeIds = nodes.map(n => n.id)

  const disconnectedQs = questions.filter(q => !nodeIds.includes(q.identifier))
  const maxY = Math.max(...nodes.map(n => n.position.y))
  disconnectedQs.forEach((dq, i) => {
    const result = getCoordiatesForNextDisconnectedNode(
      i,
      plotWidth,
      dq.identifier
    )

    const qIndex = questions.findIndex(q1 => q1.identifier === dq.identifier)
    const node = createNode(
      dq,
      qIndex,
      result.x + 20,
      result.y + maxY + 100,
      true,
      false,
      false
    )
    nodes.push(node)
  })

  return {nodes, edges, error}
}

////

function getChildEdges(
  questions: ChoiceQuestion[],
  q: ChoiceQuestion
): string[] {
  let nextIds: string[] = []
  //if surveyRules
  if (q.surveyRules) {
    //find ids we are going to next
    const nextIds = q.surveyRules.map(rule => rule.skipToIdentifier)
    const qOptions = q.choices.map(c => c.value).filter(v => v !== undefined)
    const ruleValues = q.surveyRules.map(rule => rule.matchingAnswer)
    // if all options are accounted for
    if (UtilityObject.areArraysEqual(qOptions, ruleValues)) {
      return nextIds
    }
  }

  //either use next step identifier or next step in lince
  if (q.nextStepIdentifier) {
    nextIds.push(q.nextStepIdentifier)
  } else {
    const qIndex = questions.findIndex(q1 => q1.identifier === q.identifier)
    if (qIndex < questions.length - 1 && qIndex !== -1) {
      nextIds.push(questions[qIndex + 1].identifier)
    }
  }
  return nextIds
}

export const getDryRunEdges = (questions: ChoiceQuestion[]) => {
  const edges: Edge[] = []
  let error: Error | undefined = undefined

  function addEdge(
    q: ChoiceQuestion,

    runNumber: number,
    error: Error | undefined
  ) {
    //  console.log('node', q, index)

    let nextEdges = getChildNodes(questions, q)

    if (nextEdges.length) {
      //add it if it hasn't been added, otherwise just add edge

      var i = 0
      nextEdges.forEach((child, index) => {
        //find sequential index of the quesiton

        const edge = createEdge(q.identifier, child.identifier)

        if (edges.findIndex(e => e.id === edge.id) === -1) {
          console.log(
            `%cadding ${q.identifier} to ${child.identifier}`,
            'background: #222; color: rgb(85, 218, 152)'
          )
          edges.push(edge)
          addEdge(child, ++runNumber, error)
        } else {
          console.log(
            `%cthe edge from ${q.identifier} to ${child.identifier} already exists`,
            'background: #222; color: rgb(218, 85, 105)'
          )

          // alert('THIS ALREADY EXIST' + edge.id)
        }
      })
    }
  }

  addEdge(questions[0], 0, undefined)

  return {edges, error}
}

function test(questions: ChoiceQuestion[], plotWidth: number) {
  const result = getDryRunEdges(questions)
  const edges = result.edges
  for (var edge of edges) {
  }
}

export default getNodes
