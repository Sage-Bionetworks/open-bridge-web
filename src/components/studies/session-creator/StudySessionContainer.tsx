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
import { makeStyles, Box, Button } from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import DeleteIcon from '@material-ui/icons/Delete'
import Editable from '../../widgets/Editable'


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
  onShowAssessments: Function
 onSetActiveSession: Function
 onUpdateSessionName: Function
  onUpdateAssessmentList: Function
 onRemoveSession: Function
}

const StudySessionContainer: FunctionComponent<StudySessionContainerProps> = ({
  studySession,
  onShowAssessments,
 onRemoveSession,
  onSetActiveSession,
  onUpdateSessionName,
  onUpdateAssessmentList,
}: StudySessionContainerProps) => {
  const [newSessionName, setNewSessionName]= React.useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const classes = useStyles()


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
    onUpdateAssessmentList(studySession.id, studySession.assessments.filter(a => a.id !== assessmentId))
 
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
        
        <Editable
                      text={newSessionName}
                      placeholder={studySession.name}
                      childRef={inputRef}
                      onReset={() => setNewSessionName(studySession.name)}
                      onTriggerUpdate={() => onUpdateSessionName(studySession.id, newSessionName)}
                      type="input"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        name="task"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                        placeholder={studySession.name}
                        value={newSessionName}
                        onBlur={e => {
                          onUpdateSessionName(studySession.id, newSessionName)
                        }}
                        onChange={e => {
                          setNewSessionName(e.target.value)
                        }}
                      />
                    </Editable>
 -{' '}
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
                <Button onClick={()=>onShowAssessments()}> Add Another</Button>
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
      onClick={() => onSetActiveSession(studySession.id)}
    >
      {getInner(studySession)}
      <Button
        variant="text"
        style={{ padding: '0', minWidth: 'auto' }}
        onClick={() => onRemoveSession(studySession.id)}
      >
        <DeleteIcon></DeleteIcon>
      </Button>
    </Box>
  )
}

export default StudySessionContainer
