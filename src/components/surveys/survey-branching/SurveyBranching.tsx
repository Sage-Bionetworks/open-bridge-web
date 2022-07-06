/*
function getQuestions() {
  const questions = [...Array(11)].map((v, i) => ({
    ...q,
    identifier: 'singleChoiceQ_' + i + i,
    title: q.title + 'Q ' + i,
  }))
  questions[1].nextStepIdentifier = questions[7].identifier
  questions[2].nextStepIdentifier = questions[7].identifier
  questions[3].nextStepIdentifier = questions[7].identifier
  questions[9].nextStepIdentifier = questions[4].identifier
  questions[6].nextStepIdentifier = questions[10].identifier

  questions[0].surveyRules = [
    {
      skipToIdentifier: questions[3].identifier,
    },
    {
      matchingAnswer: 1,
      skipToIdentifier: questions[1].identifier,
    },
    {
      matchingAnswer: 2,
      skipToIdentifier: questions[2].identifier,
    },
  ]

  return questions
}*/

import {Box, Button, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useSurveyConfig,
  useUpdateSurveyConfig,
} from '@services/assessmentHooks'
import {ChoiceQuestion, Step, Survey} from '@typedefs/surveys'
import {Assessment} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  FitViewOptions,
  MarkerType,
  Node,
  NodeChange,
  Position,
} from 'react-flow-renderer'
import {RouteComponentProps, useLocation, useParams} from 'react-router-dom'
import QUESTIONS, {
  getQuestionId,
} from '../survey-design/left-panel/QuestionConfigs'
import {DivContainer} from '../survey-design/left-panel/QuestionTypeDisplay'
import BranchingConfig from './BranchingConfig'

const SurveyBranchingContainerBox = styled(Box)(({theme}) => ({
  position: 'relative',

  display: 'flex',

  minHeight: 'calc(100vh - 70px)',
}))

export function useGetPlotWidth(
  ref: React.RefObject<HTMLDivElement>,
  nOfUnits: number,
  padding = 0
) {
  // save current window width in the state object
  let [width, setWidth] = React.useState(
    ref?.current?.getBoundingClientRect()?.width
  )

  // in this case useEffect will execute only once because
  // it does not have any dependencies.

  React.useLayoutEffect(() => {
    const handleResize = () => {
      if (ref && ref.current) {
        const {width} = ref?.current?.getBoundingClientRect()

        setWidth(width)
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      // remove resize listener
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {width}
}

type SurveyBranchingOwnProps = {}

function getNodeLabel(q: Step, index: number) {
  return (
    <div style={{position: 'relative'}}>
      <DivContainer>
        {QUESTIONS.get(getQuestionId(q))?.img}
        <div style={{fontSize: '12px'}}>{index + 1}</div>
        <div
          style={{
            fontSize: '12px',
            position: 'absolute',
            left: 0,
            top: '70px',
          }}>
          {'id:' + q.identifier + ' ' + q.title}
        </div>
      </DivContainer>
    </div>
  )
}

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

//const questions = getQuestions()

const getNodes = (questions: ChoiceQuestion[], plotWidth: number) => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  function getCoordiatesForNextNode(
    x: number,
    y: number,
    childNumber: number,
    totalChildren: number,
    id: string
  ) {
    const HWIDTH = 190
    const HHEIGHT = 180
    const PADDING_X = 20

    const getChildOffset = () => {
      //odd
      console.log('doing', id)
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
        console.log('%cEVEN', 'background: #222; color: rgb(218, 85, 105)')
        const middleNode = totalChildren / 2
        const y = (middleNode - (childNumber + 1)) * HHEIGHT

        return y
      }
    }

    const yOffset = getChildOffset()
    console.log('yOffset for ' + id + ' ' + yOffset)

    const nextRow = x + HWIDTH + 80 > plotWidth

    const cx = nextRow ? PADDING_X : x + HWIDTH
    const cy = nextRow ? y + HHEIGHT + 100 + yOffset : y + yOffset
    console.log('cy ', cy)
    return {x: cx, y: cy}
  }

  function getEdge(i1: string, i2: string) {
    return {
      id: i1 + '-' + i2,
      source: i1,
      target: i2,
      type: 'default', // 'straight',
      markerEnd: {type: MarkerType.ArrowClosed, color: '#000'},
    }
  }

  function getChildNodes(q: ChoiceQuestion) {
    let nextQs: ChoiceQuestion[] = []
    if (q.surveyRules) {
      console.log('doing rules')
      const nextIds = q.surveyRules.map(rule => rule.skipToIdentifier)
      nextQs = questions.filter(q1 => nextIds.includes(q1.identifier))
      console.log('nextQs', nextQs)
    }
    if (q.nextStepIdentifier) {
      const next = questions.find(q1 => q1.identifier === q.nextStepIdentifier)
      if (next) {
        nextQs.push(next)
      }
    } else {
      if (!q.surveyRules?.length) {
        const qIndex = questions.findIndex(q1 => q1.identifier === q.identifier)
        if (qIndex < questions.length - 1 && qIndex !== -1) {
          nextQs.push(questions[qIndex + 1])
        }
      }
    }
    return nextQs
  }

  function addNode(
    q: ChoiceQuestion,
    index: number,
    x: number,
    y: number,
    runNumber: number
  ) {
    //  console.log('node', q, index)
    const n = {
      id: q.identifier,
      data: {label: getNodeLabel(q, index)},
      position: {x, y},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
    nodes.push(n)
    let nextQs = getChildNodes(q)

    if (nextQs.length) {
      //add it if it hasn't been added, otherwise just add edge

      // addNode if it doesnt exist
      var i = 0
      for (var child of nextQs) {
        const qIndex = questions.findIndex(
          //find index of the quesiton
          q1 => q1.identifier === child.identifier
        )

        const edge = getEdge(q.identifier, child.identifier)
        console.log('adding edge', edge, nextQs.length)
        if (edges.findIndex(e => e.id === edge.id) === -1) {
          edges.push(edge)
        }
        const uniqs = new Set(nextQs.map(q => q.identifier))
        const result = getCoordiatesForNextNode(
          x,
          y,
          i,
          uniqs.size,
          child.identifier
        )
        console.log(child.identifier + ' ' + result)
        console.log(
          'coordinates in: ' +
            child.identifier +
            ' x:' +
            result.x +
            ', y:' +
            result.y
        )
        i++
        //  if (nodes.find(q1 => q1.id === child.identifier) === undefined) {
        if (runNumber > questions.length * 10) {
          //stack overflow
          //  alert('Stack overflow, Please refresh the page')
        } else {
          addNode(child, qIndex, result.x, result.y, ++runNumber)
          console.log('adding node', child.identifier)
          //    } else {
          //    console.log('skipping node', child.identifier)
          //  }
        }
      }
    }
  }

  /* return questions.map((q, index) => ({
    id: q.identifier,
    data: {label: getNodeLabel(q.title, index)},
    position: getPosition(index),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))*/
  addNode(questions[0], 0, 20, 20, 0)
  const minT = Math.min(...nodes.map(n => n.position.y))
  console.log(minT, 'MIN')
  if (minT < 20) {
    console.log('negativey')
    nodes.forEach(n => (n.position.y = n.position.y + Math.abs(minT) + 20))
  }
  return {nodes, edges}
}
/*
function getEdges() {
  const edgesT: Edge[] = []

  for (var i = 0; i < questions.length - 2; i++) {
    edgesT.push({
      id: questions[i].identifier + '-' + questions[i + 1].identifier,
      source: questions[i].identifier,
      target: questions[i + 1].identifier,
      type: 'straight',
      markerEnd: {type: MarkerType.Arrow, color: '#000'},
    })
  }
  return edgesT
}*/

type SurveyBranchingProps = SurveyBranchingOwnProps & RouteComponentProps

const SurveyBranching: FunctionComponent<SurveyBranchingProps> = () => {
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
  const ref = React.useRef<HTMLDivElement>(null)
  const {width} = useGetPlotWidth(ref, 7, 180)

  const location = useLocation()

  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const [error, setError] = React.useState('')
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >(-1)
  const [isHideInput, setIsHideInput] = React.useState(false)

  const [nodes, setNodes] = React.useState<Node[]>([])
  const [edges, setEdges] = React.useState<Edge[]>([])
  console.log('nodes', nodes)
  console.log('edges', edges)

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect = React.useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  )

  //rq get and modify data hooks
  const {data: _assessment, status: aStatus} = useSurveyAssessment(
    isNewSurvey() ? undefined : surveyGuid
  )
  const {data: _survey, status: cStatus} = useSurveyConfig(
    isNewSurvey() ? undefined : surveyGuid
  )

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutateAsync: mutateSurvey,
  } = useUpdateSurveyConfig()

  React.useEffect(() => {
    if (_survey) {
      console.log('%c surveyChanged', 'background: #222; color: #bada55')
      const steps = [..._survey.config.steps] as ChoiceQuestion[]
      /* steps[0].surveyRules = [
        {
          skipToIdentifier: steps[1].identifier,
        },
        {
          matchingAnswer: 1,
          skipToIdentifier: steps[3].identifier,
        },
      ]*/
      setSurvey({..._survey, config: {..._survey.config, steps: steps}})

      setSurvey(_survey)
    }
  }, [_survey])

  React.useEffect(() => {
    if (survey) {
      console.log('%c surveyChanged', 'background: #222; color: #bada55')

      const plotWidth = isHideInput ? width || 0 : (width || 0) - 620

      const result = getNodes(
        survey?.config.steps as ChoiceQuestion[],
        plotWidth
      )
      setNodes(result.nodes)
      setEdges(result.edges)
    }
  }, [survey?.config.steps, width, isHideInput])

  const saveSurvey = async (
    asmnt: Assessment,
    survey: Survey,
    action: 'UPDATE' | 'CREATE'
  ) => {
    setError('')
    try {
      await mutateSurvey({guid: surveyGuid, survey})
    } catch (error) {
      setError((error as any).toString())
    }
  }
  const onNodeClick = (x: any, node: Node) => {
    console.log('CLICKIN', node)
    //  alert(node.id)
    const qIndex = survey?.config.steps.findIndex(q => q.identifier === node.id)

    setCurrentStepIndex(qIndex)
    setIsHideInput(false)
  }

  const getNextSequentialQuestion = (id: string) => {
    if (survey) {
      const qIndex = survey.config.steps.findIndex(q => q.identifier === id)
      if (qIndex < 0 || qIndex === survey?.config.steps.length - 1) {
        return undefined
      }
      return survey.config.steps[qIndex + 1]
    }
  }

  return (
    <Box width="100%" sx={{display: 'block', position: 'relative'}}>
      <Box ref={ref} sx={{border: '1px solid blue'}}>
        <div
          style={{
            width: isHideInput ? width || 0 : (width || 0) - 520 + 'px',
            height: '800px',
            border: '1px solid red',
          }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // fitView
            fitViewOptions={fitViewOptions}
          />
        </div>
      </Box>
      CI ={currentStepIndex}
      {survey?.config.steps &&
        currentStepIndex !== undefined &&
        !isHideInput &&
        survey.config.steps[currentStepIndex] && (
          <Box
            sx={{
              width: '424px',
              border: '1px solid black',
              position: 'absolute',
              top: '0',
              right: '0',
            }}>
            <BranchingConfig
              onChange={steps => {
                console.log('steps', steps)
                setSurvey({...survey, config: {...survey.config, steps: steps}})
              }}
              questions={survey.config.steps as ChoiceQuestion[]}
              step={survey.config.steps[currentStepIndex] as ChoiceQuestion}
            />

            <Button onClick={() => setIsHideInput(true)}>Hide input</Button>
          </Box>
        )}
    </Box>
  )
}
export default SurveyBranching
