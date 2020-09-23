import React, { FunctionComponent } from 'react'


import { StudySession } from '../../../types/types'
import { Droppable,  Draggable } from 'react-beautiful-dnd'

import clsx from 'clsx'
import { makeStyles, Box, Button } from '@material-ui/core'
import AssessmentSmall from '../../assessments/AssessmentSmall'

const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',
    width: '265px',
    marginRight: '26px',
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
      boxShadow: '0px 5px 5px #0908f3;'

    }
  },
})

type StudySessionContainerProps = {
  studySession?: StudySession
  onAddSession?: Function
}

const StudySessionContainer: FunctionComponent<StudySessionContainerProps> = ({
  studySession,
  onAddSession = () => {},
}: StudySessionContainerProps) => {
  console.log('redraw')
  console.log(studySession?.assessments.length)
  const classes = useStyles()

  const getInner = (studySession?: StudySession): JSX.Element => {
    if (!studySession) {
      return (
        <>
          <Button variant="text" onClick={() => onAddSession()}>
            + Create new session
          </Button>
        </>
      )
    } else {
      return (
        <>
          {studySession.assessments.length} {studySession.name} -{' '}
          {studySession.duration} min.
          <Droppable droppableId={studySession.id} type="TASK">
            {(provided, snapshot) => (
              <div
                className={clsx({[classes.inner]: true, 'dragging': snapshot.isDraggingOver})}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {studySession.assessments.map((assessment, index) => (
                  <Draggable draggableId={assessment.id + index} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <AssessmentSmall assessment={assessment} isDragging={snapshot.isDragging}/>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </>
      )
    }
  }
  return <Box className={classes.root}>{getInner(studySession)}</Box>
}

export default StudySessionContainer
