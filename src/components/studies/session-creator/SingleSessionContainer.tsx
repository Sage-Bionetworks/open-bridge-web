import React, { FunctionComponent, useRef } from 'react'

import { Assessment, StudySession } from '../../../types/types'
import {
  Droppable,
  Draggable,
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'

import clsx from 'clsx'
import {
  makeStyles,
  Box,
  Button,
  FormLabel,
  Switch,
  FormControlLabel,
} from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import ClearIcon from '@material-ui/icons/Clear'
import ClockIcon from '@material-ui/icons/AccessTime'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditableTextbox from '../../widgets/EditableTextbox'
import { ThemeType } from '../../../style/theme'
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
  studySession: StudySession
  onShowAssessments: Function
  onSetActiveSession: Function
  onUpdateSessionName: Function
  onUpdateAssessmentList: Function
  onRemoveSession: Function
}

const SingleSessionContainer: FunctionComponent<SingleSessionContainerProps> = ({
  studySession,
  onShowAssessments,
  onRemoveSession,
  onSetActiveSession,
  onUpdateSessionName,
  onUpdateAssessmentList,
}: SingleSessionContainerProps) => {
  const classes = useStyles()
  const [isEditable, setIsEditable] = React.useState(false)

  const rearrangeAssessments = (
    assessments: Assessment[],
    dropResult: DropResult,
  ) => {
    if (!dropResult.destination) {
      return
    }
    const newAssessmentList = rearrangeList(
      assessments,
      dropResult.source,
      dropResult.destination,
    )
    onUpdateAssessmentList(studySession.id, newAssessmentList)
  }

  const removeAssessment = (assessmentId: string) => {
    console.log('removing')
    onUpdateAssessmentList(
      studySession.id,
      studySession.assessments.filter(a => a.guid !== assessmentId),
    )
  }

  const getTotalSessionTime = (assessments: Assessment[]): number => {
    const result = assessments.reduce((prev, curr, ndx) => {
      return prev + Number(curr.duration)
    }, 0)
    return result
  }

  const getInner = (studySession: StudySession): JSX.Element => {
    return (
      <>
        <Box className={classes.inner}>
          <Box marginRight="16px">
          <SessionIcon  index={studySession.order}>
            <EditableTextbox
              component="h4"
              initValue={studySession.name}
              onTriggerUpdate={(newValue: string) =>
                onUpdateSessionName(studySession.id, newValue)
              }
            ></EditableTextbox>
            </SessionIcon>
          </Box>

          <Button
            variant="text"
            className={classes.btnDeleteSession}
            onClick={e => {
              e.stopPropagation()
              onRemoveSession(studySession.id)
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
            <Droppable droppableId={studySession.id} type="ASSESSMENT">
              {(provided, snapshot) => (
                <div
                  className={clsx({
                    dragging: snapshot.isDraggingOver,
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {studySession.assessments.length === 0 && (
                    <Box marginTop="60px" padding="20px">
                      Add assessments to this session by clicking on the "+"
                      below.{' '}
                    </Box>
                  )}
                  {studySession.assessments.map((assessment, index) => (
                    <Draggable
                      draggableId={assessment.guid}
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
    <Box
      className={clsx(classes.root /*, studySession?.active && 'active')*/)}
      onClick={() => onSetActiveSession(studySession.id)}
    >
      {getInner(studySession)}

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
  )
}

export default SingleSessionContainer
