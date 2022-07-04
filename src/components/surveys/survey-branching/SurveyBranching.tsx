import UtilityObject from '@helpers/utility'
import {Box, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useSurveyConfig,
  useUpdateSurveyAssessment,
  useUpdateSurveyConfig,
  useUpdateSurveyResource,
} from '@services/assessmentHooks'
import {ChoiceQuestion, Survey} from '@typedefs/surveys'
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
import {
  RouteComponentProps,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom'
import QUESTIONS from '../survey-design/left-panel/QuestionConfigs'
import {DivContainer} from '../survey-design/left-panel/QuestionTypeDisplay'

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

function getNodeLabel(title: string, index: number) {
  return (
    <div style={{position: 'relative'}}>
      <DivContainer>
        {QUESTIONS.get('LIKERT')?.img}
        <div style={{fontSize: '12px'}}>{index}</div>
        <div
          style={{
            fontSize: '12px',
            position: 'absolute',
            left: 0,
            top: '40px',
          }}>
          {title}
        </div>
      </DivContainer>
    </div>
  )
}

const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: (
        <div style={{position: 'relative'}}>
          {' '}
          <DivContainer>
            {QUESTIONS.get('LIKERT')?.img}
            <div style={{fontSize: '12px'}}>3</div>
            <div
              style={{
                fontSize: '12px',
                position: 'absolute',
                left: 0,
                top: '40px',
              }}>
              How often have you been upset because of something that happened
              unexpectedly?{' '}
            </div>
          </DivContainer>
        </div>
      ),
    },
    position: {x: 5, y: 5},
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    data: {label: 'Node 2'},
    position: {x: 250, y: 5},
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '21',
    data: {label: 'Node 2'},
    position: {x: 250, y: -50},
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '22',
    data: {label: 'Node 2'},
    position: {x: 250, y: 50},
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    data: {label: 'Node 3'},
    position: {x: 450, y: 5},
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '4',
    data: {label: 'Node 4'},
    position: {x: 950, y: 150},
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
]

const initialEdges: Edge[] = [
  {id: 'e1-2', source: '1', target: '2', type: 'straight'},
  {id: 'e1-21', source: '1', target: '21', type: 'straight'},
  {id: 'e1-22', source: '1', target: '22', type: 'straight'},
  {id: 'e2-3', source: '2', target: '3', type: 'straight'},
  {id: 'e3-4', source: '3', target: '4', type: 'straight'},
]

const q: ChoiceQuestion = {
  type: 'choiceQuestion',
  identifier: 'singleChoiceQ_xrbrbf',
  subtitle: 'Subtitle',
  title:
    'How often have you been upset because of something that happened  unexpectedly?',
  detail: 'Detail',
  baseType: 'string',
  singleChoice: true,
  choices: [
    {
      value: 'Choice A',
      text: 'Choice A',
    },
    {
      value: 'Choice B',
      text: 'Choice B',
    },
    {
      text: 'Choice D',
      value: 'Choice D',
    },
    {
      text: 'Choice C',
      value: 'Choice C',
    },
  ],
  other: {
    type: 'string',
  },
}

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

function getQuestions() {
  const questions = [...Array(11)].map((v, i) => ({
    ...q,
    identifier:
      'singleChoiceQ_' +
      UtilityObject.generateNonambiguousCode(3, 'CONSONANTS'),
    title: q.title + 'Q ' + i,
  }))
  questions[3].nextStepIdentifier = questions[7].identifier
  questions[9].nextStepIdentifier = questions[4].identifier
  questions[6].nextStepIdentifier = questions[10].identifier
  return questions
}

const questions = getQuestions()

function getPosition(index: number) {
  const max = 800
  const numPerRow = Math.floor(800 / 190)
  const x = (index % numPerRow) * 190
  const y = Math.floor(index / numPerRow)
  return {x: x, y: y * 180}
}

const getNodes = () => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  function addNode(q: ChoiceQuestion, index: number, x: number, y: number) {
    //  console.log('node', q, index)
    const n = {
      id: q.identifier,
      data: {label: getNodeLabel(q.title, index)},
      position: {x, y},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
    nodes.push(n)
    let nextQ: ChoiceQuestion | undefined
    if (q.nextStepIdentifier) {
      nextQ = questions.find(q1 => q1.identifier === q.nextStepIdentifier)
    } else {
      const qIndex = questions.findIndex(q1 => q1.identifier === q.identifier)
      nextQ =
        qIndex === questions.length - 1 || qIndex === -1
          ? undefined
          : questions[qIndex + 1]
    }
    // console.log('next: ' + nextQ?.title)

    if (nextQ) {
      const qIndex = questions.findIndex(
        q1 => q1.identifier === nextQ!.identifier
      )
      const nextRow = x + 250 > 800
      console.log('x ' + x, x + 190, nextRow)
      const cx = nextRow ? 0 : x + 190
      const cy = nextRow ? y + 180 : y
      console.log('next: ' + nextQ?.title, cx, cy)
      edges.push({
        id: q.identifier + '-' + nextQ.identifier,
        source: q.identifier,
        target: nextQ.identifier,
        type: 'default', // 'straight',
        markerEnd: {type: MarkerType.Arrow, color: '#000'},
      })
      addNode(nextQ, qIndex, cx, cy)
    }
  }

  /* return questions.map((q, index) => ({
    id: q.identifier,
    data: {label: getNodeLabel(q.title, index)},
    position: getPosition(index),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))*/
  addNode(questions[0], 0, 0, 0)
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
  console.log('WIDTH is,', width)
  const history = useHistory()
  const location = useLocation()
  const [assessment, setAssessment] = React.useState<Assessment | undefined>()
  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const [error, setError] = React.useState('')
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >(getQuestionIndexFromSearchString())

  const [nodes, setNodes] = React.useState<Node[]>(getNodes().nodes)
  const [edges, setEdges] = React.useState<Edge[]>(getNodes().edges)
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
    isSuccess: asmntUpdateSuccess,
    isError: asmntUpdateError,
    mutateAsync: mutateAssessment,
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
    }
  }, [_survey])

  const saveAssessment = async (
    asmnt: Assessment,
    survey: Survey,
    action: 'UPDATE' | 'CREATE'
  ) => {
    setError('')
    try {
      const result = await mutateAssessment({assessment: asmnt, action})
      await mutateSurvey({guid: result.guid!, survey})

      console.log('success')
      console.log(result)
      history.push(`/surveys/${result.guid}/design/title`)
      console.log('reloading')
    } catch (error) {
      setError((error as any).toString())
    }
  }

  return (
    <div style={{width: '800px', height: '800px', border: '1px solid black'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // fitView
        fitViewOptions={fitViewOptions}
      />
    </div>
  )
}
export default SurveyBranching
