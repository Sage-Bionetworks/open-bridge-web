import {Box, styled} from '@mui/material'
import {useSurveyConfig, useUpdateSurveyConfig} from '@services/assessmentHooks'
import {latoFont} from '@style/theme'
import {SmartStepEdge} from '@tisoap/react-flow-smart-edge'
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
  Node,
  NodeChange,
} from 'react-flow-renderer'

import {RouteComponentProps, useParams} from 'react-router-dom'
import BranchingConfig from './BranchingConfig'
import getNodes, {getDryRunEdges} from './GetNodesToPlot'
import {useGetPlotWidth} from './UseGetPlotWidth'

const edgeTypes = {
  smart: SmartStepEdge,
}

const SurveyBranchingContainerBox = styled(Box)(({theme}) => ({
  position: 'relative',
  backgroundColor: '#fcfcfc',
  // display: 'flex',
  width: '100%',
  // border: '1px solid black',

  minHeight: 'calc(100vh - 75px)',
  '& .react-flow': {
    backgroundColor: '#fcfcfc',
  },
  '& .react-flow__node-default': {
    borderRadius: 0,
    background: '#F2F2F2',
    border: 'none',
    padding: 0,
    textAlign: 'center',

    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    width: '85px',
    height: '48px',
    fontFamily: latoFont,
    fontWeight: 700,
    fontSize: '14px',
    color: ' #4d4d4d',
    '& .react-flow__handle': {
      backgroundColor: 'transparent',
      borderRadius: '0',
      border: 'none',
      //border: '1px solid black',
    },
    '&.selected': {
      border: '1px solid black',
    },
  },
}))

type SurveyBranchingOwnProps = {}

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

type SurveyBranchingProps = SurveyBranchingOwnProps & RouteComponentProps

const SurveyBranching: FunctionComponent<SurveyBranchingProps> = () => {
  let {id: surveyGuid} = useParams<{
    id: string
  }>()

  const ref = React.useRef<HTMLDivElement>(null)
  const {width} = useGetPlotWidth(ref)
  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const [error, setError] = React.useState('')
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >(-1)
  const [isHideInput, setIsHideInput] = React.useState(true)

  const [nodes, setNodes] = React.useState<Node[]>([])
  const [edges, setEdges] = React.useState<Edge[]>([])

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

  const {data: _survey, status: cStatus} = useSurveyConfig(surveyGuid)

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutateAsync: mutateSurvey,
  } = useUpdateSurveyConfig()

  React.useEffect(() => {
    if (_survey) {
      console.log('%c surveyChanged', 'background: #222; color: #bada55')
      setSurvey(_survey)
    }
  }, [_survey])

  React.useEffect(() => {
    if (survey) {
      console.log('%c surveyStepsChanged', 'background: #222; color: #bada55')

      const plotWidth = isHideInput ? width || 0 : (width || 0) - 500

      const result = getNodes(
        survey?.config.steps as ChoiceQuestion[],
        plotWidth
      )
      if (result.error) {
        setError(result.error)
      } else {
        setNodes(result.nodes)
        setEdges(result.edges)
      }
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
    const qIndex = survey!.config.steps!.findIndex(
      q => q.identifier === node.id
    )
    if (qIndex < survey!.config.steps.length - 1) {
      setCurrentStepIndex(qIndex)
      setIsHideInput(false)
    }
  }

  return (
    <SurveyBranchingContainerBox width="100%" sx={{}}>
      {error && <span>{error.toString()}</span>}
      <Box ref={ref}>
        <div
          style={{
            width: isHideInput ? width || 0 : (width || 0) - 424 + 'px',
            height: 'calc(100vh - 75px)',
          }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            // fitView
            fitViewOptions={fitViewOptions}
          />
        </div>
      </Box>

      {survey?.config.steps &&
        currentStepIndex !== undefined &&
        !isHideInput &&
        survey.config.steps[currentStepIndex] && (
          <Box
            sx={{
              width: '424px',
              height: 'calc(100vh - 75px)',
              borderLeft: '1px solid black',
              position: 'absolute',
              top: '0',
              right: '0',
            }}>
            <BranchingConfig
              onHide={() => setIsHideInput(true)}
              sourceNodesIds={edges
                .filter(
                  e =>
                    e.target ===
                    survey.config.steps[currentStepIndex].identifier
                )
                .map(n => n.source)
                .concat([survey.config.steps[currentStepIndex].identifier])}
              onChange={steps => {
                console.log('steps', steps)
                const edges = getDryRunEdges(steps)
                console.log('DRY RUN', edges)
                setSurvey({...survey, config: {...survey.config, steps: steps}})
              }}
              questions={survey.config.steps as ChoiceQuestion[]}
              step={survey.config.steps[currentStepIndex] as ChoiceQuestion}
            />
          </Box>
        )}
    </SurveyBranchingContainerBox>
  )
}
export default SurveyBranching
