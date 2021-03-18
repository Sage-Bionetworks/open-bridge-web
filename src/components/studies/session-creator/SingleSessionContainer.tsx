import {
  Box,
  Button,


  FormControlLabel, makeStyles,



  Switch
} from '@material-ui/core'
import ClockIcon from '@material-ui/icons/AccessTime'
import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import {
  DragDropContext, Draggable,

  DraggableLocation, Droppable,



  DropResult
} from 'react-beautiful-dnd'
import { ThemeType } from '../../../style/theme'
import { StudySession } from '../../../types/scheduling'
import { Assessment } from '../../../types/types'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import EditableTextbox from '../../widgets/EditableTextbox'
import SessionIcon from '../../widgets/SessionIcon'



const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    /*'&.active': {
      border: theme.activeBorder,
    },*/
  },
  inner: {
    position: 'relative',
    textAlign: 'left',
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid black',
  },
  btnDeleteSession: {
    padding: '0',
    minWidth: 'auto',
    position: 'absolute',
    right: '-3px',
    top: '-3px',
  },
  btnDeleteAssessment: {
    padding: '0',
    minWidth: 'auto',
    position: 'absolute',
    top: '35px',
    right: theme.spacing(1),
  },
  actions: {
    borderTop: '1px solid black',
    height: theme.spacing(6),
    display: 'flex',
    padding: 0,
    justifyContent: 'space-between',
  },
  droppable: {
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    height: '376px',
    overflowY: 'scroll',
    '&.empty': {
      border: '1px dashed #C4C4C4',
    },
    '&.dragging': {
      border: '2px solid #C4C4C4',
      boxShadow: '0px 5px 5px #0908f3;',
    },
  },
}))

const rearrangeList = (
  list: any[],
  source: DraggableLocation,
  destination: DraggableLocation,
) => {
  const startIndex = source.index

  const endIndex = destination.index

  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

type SingleSessionContainerProps = {
  sessionIndex: number
  studySession: StudySession
  onShowAssessments: Function
  onSetActiveSession: Function
  onUpdateSessionName: Function
  onUpdateAssessmentList: Function
  onRemoveSession: Function
}

const SingleSessionContainer: FunctionComponent<SingleSessionContainerProps> = ({
  sessionIndex,
  studySession,
  onShowAssessments,
  onRemoveSession,
  onSetActiveSession,
  onUpdateSessionName,
  onUpdateAssessmentList,
}: SingleSessionContainerProps) => {
  const classes = useStyles()
  const [isEditable, setIsEditable] = React.useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)
  console.log(studySession, 'session')

  const rearrangeAssessments = (
    assessments: Assessment[] | undefined,
    dropResult: DropResult,
  ) => {
    if (!dropResult.destination || !assessments) {
      return
    }
    const newAssessmentList = rearrangeList(
      assessments,
      dropResult.source,
      dropResult.destination,
    )
    onUpdateAssessmentList(studySession.guid, newAssessmentList)
  }

  const removeAssessment = (assessmentId: string) => {
    if (!studySession.assessments) {return}

    onUpdateAssessmentList(
      studySession.guid,
      studySession.assessments.filter(a => a.guid !== assessmentId),
    )
  }

  const getTotalSessionTime = (assessments?: Assessment[]): number => {
    if (! assessments) {
      return 0
    }
    const result = assessments.reduce((prev, curr, ndx) => {
      return prev + Number(curr.duration)
    }, 0)
    return result
  }

  const getInner = (studySession: StudySession, sessionIndex: number): JSX.Element => {
    return (
      <>
        <Box className={classes.inner}>
          <Box marginRight={2}>
            <SessionIcon index={sessionIndex}>
              <EditableTextbox
                component="h4"
                initValue={studySession.name}
                onTriggerUpdate={(newValue: string) =>
                  onUpdateSessionName(studySession.guid, newValue)
                }
              ></EditableTextbox>
            </SessionIcon>
          </Box>

          <Button
            variant="text"
            className={classes.btnDeleteSession}
            onClick={e => {
              e.stopPropagation()
              //onRemoveSession(studySession.guid)
              setIsConfirmDeleteOpen(true)
            }}
          >
            <ClearIcon fontSize="small"></ClearIcon>
          </Button>
          <Box fontSize="12px" textAlign="right">
            {getTotalSessionTime(studySession.assessments) || 0} min.
            <ClockIcon
              style={{ fontSize: '12px', verticalAlign: 'middle' }}
            ></ClockIcon>
          </Box>
        </Box>

        <DragDropContext
          onDragEnd={(dropResult: DropResult) =>
            rearrangeAssessments(studySession.assessments, dropResult)
          }
        >
          <div className={classes.droppable}>
            <Droppable droppableId={studySession.guid} type="ASSESSMENT">
              {(provided, snapshot) => (
                <div
                  className={clsx({
                    dragging: snapshot.isDraggingOver,
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {!studySession.assessments ||studySession.assessments.length === 0 && (
                    <Box marginTop={7} padding={2}>
                      Add assessments to this session by clicking on the "+"
                      below.{' '}
                    </Box>
                  )}
                  {studySession.assessments?.map((assessment, index) => (
                    <Draggable
                      draggableId={assessment.guid+index}
                      index={index}
                      key={assessment.guid}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <AssessmentSmall
                            assessment={assessment}
                            isDragging={snapshot.isDragging}
                          >
                            {isEditable && (
                              <Button
                                variant="text"
                                className={classes.btnDeleteAssessment}
                                onClick={e => {
                                  e.stopPropagation()
                                  removeAssessment(assessment.guid)
                                }}
                              >
                                <DeleteIcon></DeleteIcon>
                              </Button>
                            )}
                          </AssessmentSmall>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </>
    )
  }
  return (
    <>
      <Box
        className={clsx(classes.root /*, studySession?.active && 'active')*/)}
        onClick={() => onSetActiveSession(studySession.guid)}
      >
        {getInner(studySession, sessionIndex)}

        <Box className={classes.actions}>
          <FormControlLabel
            control={
              <Switch
                value={isEditable}
                onChange={e => setIsEditable(e.target.checked)}
              />
            }
            label="Edit"
          />

          <Button
            onClick={() => onShowAssessments()}
            variant="text"
            style={{ padding: '0px', minWidth: 'auto' }}
          >
            <AddIcon></AddIcon>
          </Button>
        </Box>
      </Box>
      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        title={'Delete Session'}
        type={'DELETE'}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          setIsConfirmDeleteOpen(false)
          onRemoveSession(studySession.guid)
        }}
      >
        <div>
          Are you sure you would like to permanently delete:{' '}
          <p>{studySession.name}</p>
        </div>
      </ConfirmationDialog>
    </>
  )
}

export default SingleSessionContainer
