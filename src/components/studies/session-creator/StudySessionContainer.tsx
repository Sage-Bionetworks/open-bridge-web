import React, { FunctionComponent } from 'react'

import { Assessment, StudySession } from '../../../types/types'
import {
  Droppable,
  Draggable,
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'

import clsx from 'clsx'
import { makeStyles, Box, Button } from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import DeleteIcon from '@material-ui/icons/Delete'
import {
  useStudySessionsState,
  useStudySessionsDispatch,
  Types,
} from '../../../helpers/StudySessionsContext'

const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',
    width: '265px',
    marginRight: '26px',
    '&.active': {
      border: '1px solid blue',
    },
  },
  inner: {
    border: '1px solid #C4C4C4',
    padding: '12px',
    minHeight: '240px',

    '&.empty': {
      border: '1px dashed #C4C4C4',
    },
    '&.dragging': {
      border: '2px solid #C4C4C4',
      boxShadow: '0px 5px 5px #0908f3;',
    },
  },
})

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

type StudySessionContainerProps = {
  studySession: StudySession
 // onSetActiveSession: Function
  //onUpdateAssessments: Function
 // onRemoveSession: Function
}

const StudySessionContainer: FunctionComponent<StudySessionContainerProps> = ({
  studySession,
 // onRemoveSession,
  //onSetActiveSession,
  //onUpdateAssessments,
}: StudySessionContainerProps) => {
  const classes = useStyles()
  const sessionUpdateFn = useStudySessionsDispatch()

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
   sessionUpdateFn({type: Types.UpdateAssessments, payload: {sessionId: studySession.id,  assessments: newAssessmentList}})
  }

  const removeAssessment = (assessmentId: string) => {
    sessionUpdateFn({type: Types.UpdateAssessments, payload: {sessionId: studySession.id,  assessments:  studySession.assessments.filter(a => a.id !== assessmentId)}})
 
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
        {studySession.assessments.length} {studySession.name} -{' '}
        {getTotalSessionTime(studySession.assessments)} min.
        <DragDropContext
          onDragEnd={(dropResult: DropResult) =>
            rearrangeAssessments(studySession.assessments, dropResult)
          }
        >
          <Droppable droppableId={studySession.id} type="TASK">
            {(provided, snapshot) => (
              <div
                className={clsx({
                  [classes.inner]: true,
                  dragging: snapshot.isDraggingOver,
                })}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {studySession.assessments.map((assessment, index) => (
                  <Draggable
                    draggableId={assessment.id}
                    index={index}
                    key={assessment.id}
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
                          {' '}
                          <Button
                            variant="text"
                            style={{ padding: '0', minWidth: 'auto' }}
                            onClick={() => removeAssessment(assessment.id)}
                          >
                            <DeleteIcon></DeleteIcon>
                          </Button>
                        </AssessmentSmall>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    )
  }
  return (
    <Box
      className={clsx(classes.root, studySession?.active && 'active')}
      onClick={() => sessionUpdateFn({type: Types.SetActiveSession, payload: {sessionId: studySession.id}})}
    >
      {getInner(studySession)}
      <Button
        variant="text"
        style={{ padding: '0', minWidth: 'auto' }}
        onClick={() => sessionUpdateFn({type: Types.RemoveSession, payload: {sessionId: studySession.id}})}
      >
        <DeleteIcon></DeleteIcon>
      </Button>
    </Box>
  )
}

export default StudySessionContainer
