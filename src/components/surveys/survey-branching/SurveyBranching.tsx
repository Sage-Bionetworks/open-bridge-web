import {Box, styled} from '@mui/material'
import {
  useSurveyAssessment,
  useSurveyConfig,
  useUpdateSurveyAssessment,
  useUpdateSurveyConfig,
  useUpdateSurveyResource,
} from '@services/assessmentHooks'
import {Survey} from '@typedefs/surveys'
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
  Node,
  NodeChange,
} from 'react-flow-renderer'
import {
  RouteComponentProps,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom'

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

const initialNodes: Node[] = [
  {id: '1', data: {label: 'Node 1'}, position: {x: 5, y: 5}},
  {id: '2', data: {label: 'Node 2'}, position: {x: 5, y: 100}},
]

const initialEdges: Edge[] = [{id: 'e1-2', source: '1', target: '2'}]

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

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

  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges)

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
    <div>
      FLOW start
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={fitViewOptions}
      />
    </div>
  )
}
export default SurveyBranching
