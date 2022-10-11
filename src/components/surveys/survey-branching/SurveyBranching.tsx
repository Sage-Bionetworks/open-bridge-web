import ConfirmationDialog from '@components/widgets/ConfirmationDialog';
import { Box, styled } from '@mui/material';
import { useSurveyConfig, useUpdateSurveyConfig } from '@services/assessmentHooks';
import { latoFont } from '@style/theme';
import { ChoiceQuestion, Survey } from '@typedefs/surveys';
import dagre from 'dagre';
import React, { FunctionComponent } from 'react';
import 'reactflow/dist/style.css';

import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  ConnectionLineType,
  Edge,
  EdgeChange,
  FitViewOptions,
  Node,
  NodeChange,
  Position
} from 'reactflow';

import { RouteComponentProps, useParams } from 'react-router-dom';
import NavigationPrompt from 'react-router-navigation-prompt';
import BranchingConfig from './BranchingConfig';
import getNodes from './GetNodesToPlot';
import { useGetPlotWidth } from './UseGetPlotWidth';

/*const edgeTypes = {
  smart: SmartStepEdge,
}*/

const SurveyBranchingContainerBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#fcfcfc',
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 75px)',
  overflow: 'scroll',
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



const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 70;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, marginy: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {

    dagreGraph.setEdge(edge.source, edge.target,);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};



const SurveyBranching: FunctionComponent<SurveyBranchingProps> = () => {
  let { id: surveyGuid } = useParams<{
    id: string
  }>()

  const ref = React.useRef<HTMLDivElement>(null)
  const { width } = useGetPlotWidth(ref)
  const [survey, setSurvey] = React.useState<Survey | undefined>()
  const [error, setError] = React.useState('')
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [currentStepIndex, setCurrentStepIndex] = React.useState<
    number | undefined
  >(-1)
  const [isHideInput, setIsHideInput] = React.useState(true)

  const [nodes, setNodes] = React.useState<Node[]>([])
  const [edges, setEdges] = React.useState<Edge[]>([])


  //dagre
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

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

  const { data: _survey } = useSurveyConfig(surveyGuid)

  const { mutateAsync: mutateSurvey } = useUpdateSurveyConfig()

  React.useEffect(() => {
    if (_survey) {
      setSurvey(_survey)
    }
  }, [_survey])

  React.useEffect(() => {
    if (survey) {
      console.log('repanting')
      const plotWidth = width || 0
      const result = getNodes(
        survey?.config.steps as ChoiceQuestion[],
        plotWidth
      )
      if (result.error) {
        setError(result.error)
      } else {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          result.nodes,
          result.edges
        );
        setNodes([...layoutedNodes])
        setEdges([...layoutedEdges])
      }
    }
  }, [survey, survey?.config.steps, width])

  const saveSurvey = async () => {
    setError('')
    try {
      await mutateSurvey({ guid: surveyGuid, survey: survey! })
      setHasObjectChanged(false)
      setIsHideInput(true)
    } catch (error) {
      setError((error as any).toString())
    }
  }

  const changeBranching = (steps: ChoiceQuestion[]) => {

    setHasObjectChanged(true)
    setSurvey({
      ...survey,
      config: { ...survey!.config, steps: steps },
    })

  }

  const onNodeClick = (x: any, node: Node) => {
    const qIndex = survey!.config.steps!.findIndex(
      q => q.identifier === node.id
    )
    if (qIndex < survey!.config.steps.length - 1) {
      setCurrentStepIndex(qIndex)
      setIsHideInput(false)
    }
  }

  const getCurrentStep = (): ChoiceQuestion | undefined =>
    survey && currentStepIndex !== undefined
      ? (survey.config.steps[currentStepIndex] as ChoiceQuestion)
      : undefined

  const getInvalidTargetStepIds = (): string[] => {
    const currentStep = getCurrentStep()
    if (!currentStep) {
      return []
    }
    const sourceNodesIds = edges
      .filter(e => e.target === currentStep.identifier)
      .map(n => n.source)
      .concat([currentStep.identifier])
    return sourceNodesIds
  }

  const findHeightOfNodes = () => {
    const yPos = nodes.map(n => n.position.y)
    const max = Math.max(...yPos)
    return max + 150
  }

  return (
    <>
      <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
        {({ onConfirm, onCancel }) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>

      <SurveyBranchingContainerBox>
        {error && <span>{error.toString()}</span>}
        <Box ref={ref}>
          <div
            style={{
              width: (width || 0) + 'px',
              height: `${findHeightOfNodes()}px`,
            }}>
            <ReactFlow
              style={{}}
              zoomOnScroll={false}
              nodes={nodes}
              edges={edges}
              onNodeClick={onNodeClick}
              onNodesChange={onNodesChange}
              // onEdgesChange={onEdgesChange}
              preventScrolling={false}
              //  onConnect={onConnect}
              connectionLineType={ConnectionLineType.SmoothStep}
              fitView={false}
              fitViewOptions={fitViewOptions}
            />
          </div>
        </Box>

        {edges && (getCurrentStep() !== undefined) && (
          <BranchingConfig
            onCancel={() => {
              setSurvey(_survey)
              setIsHideInput(true)
            }}
            error={error}
            onSave={() => saveSurvey()}
            isOpen={!isHideInput}
            invalidTargetStepIds={getInvalidTargetStepIds()}
            onChange={steps => changeBranching(steps)}
            questions={survey!.config.steps as ChoiceQuestion[]}
            step={getCurrentStep()!}
          />
        )}
      </SurveyBranchingContainerBox>
    </>
  )
}
export default SurveyBranching
