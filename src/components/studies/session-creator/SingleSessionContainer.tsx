import AssessmentSmall from '@components/assessments/AssessmentSmall'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import EditableTextbox from '@components/widgets/EditableTextbox'
import SessionIcon from '@components/widgets/SessionIcon'
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import {Box, Button, FormControlLabel, IconButton} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {theme, ThemeType} from '@style/theme'
import {StudySession} from '@typedefs/scheduling'
import {Assessment} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {DragDropContext, Draggable, DraggableLocation, Droppable, DropResult} from 'react-beautiful-dnd'

export const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  inner: {
    position: 'relative',
    textAlign: 'left',
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid #DFE2E6',

    '& h4': {
      // fontWeight: '700',
      //  fontSize: '14px',
      // lineHeight: '20px',

      textDecoration: 'underline',

      color: theme.palette.primary.main,
    },
  },
  btnDeleteSession: {
    padding: '0',
    minWidth: 'auto',
    position: 'absolute',
    right: '-3px',
    top: '10px',
  },
  btnDeleteAssessment: {
    padding: theme.spacing(1.25, 1.25),
    minWidth: 'auto',
    position: 'absolute',
    top: '24px',
    backgroundColor: '#fff',
    right: theme.spacing(0),

    borderRadius: '0px',
    '& svg': {
      fontSize: '18px',
      display: 'block',
    },
  },
  actions: {
    borderTop: '1px solid #DFE2E6',
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
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#C4C4C4',
      borderRadius: '4px',
    },
    paddingRight: theme.spacing(0.75),
    margin: theme.spacing(0.75, 0),
  },
}))

const rearrangeList = (list: any[], source: DraggableLocation, destination: DraggableLocation) => {
  const startIndex = source.index

  const endIndex = destination.index

  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const getTotalSessionTime = (assessments?: Assessment[]): number => {
  if (!assessments) {
    return 0
  }
  const result = assessments.reduce((prev, curr, ndx) => {
    return prev + (Number(curr.minutesToComplete) || 0)
  }, 0)
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
  numberOfSessions: number
}
export const SessionTimeDisplay: FunctionComponent<{assessments: Assessment[] | undefined}> = ({assessments}) => {
  return (
    <Box sx={{fontSize: '12px', textAlign: 'right', color: '#4A5056'}}>
      {getTotalSessionTime(assessments) || 0} min
      <AccessTimeTwoToneIcon
        sx={{
          fontSize: '12px',
          color: '#878E95',
          verticalAlign: 'middle',
          marginLeft: theme.spacing(0.5),
        }}></AccessTimeTwoToneIcon>
    </Box>
  )
}
const SingleSessionContainer: FunctionComponent<SingleSessionContainerProps> = ({
  sessionIndex,
  studySession,
  onShowAssessments,
  onRemoveSession,
  onSetActiveSession,
  onUpdateSessionName,
  onUpdateAssessmentList,
  numberOfSessions,
}: SingleSessionContainerProps) => {
  const classes = useStyles()
  const [isEditable, setIsEditable] = React.useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const rearrangeAssessments = (assessments: Assessment[] | undefined, dropResult: DropResult) => {
    if (!dropResult.destination || !assessments) {
      return
    }
    const newAssessmentList = rearrangeList(assessments, dropResult.source, dropResult.destination)
    onUpdateAssessmentList(studySession.guid!, newAssessmentList)
  }

  const removeAssessment = (assessmentId: string) => {
    if (!studySession.assessments) {
      return
    }
    const removeIndex = studySession.assessments.findIndex(a => a.guid === assessmentId)
    const result = [...studySession.assessments]
    result.splice(removeIndex, 1)

    onUpdateAssessmentList(studySession.guid!, result)
  }

  const getInner = (studySession: StudySession, sessionIndex: number, numberOfSessions: number): JSX.Element => {
    return (
      <>
        <Box className={classes.inner}>
          <Box marginRight={2}>
            <SessionIcon index={sessionIndex} symbolKey={studySession.symbol}>
              <EditableTextbox
                maxCharacters={18}
                component="h4"
                initValue={studySession.name}
                onTriggerUpdate={(newValue: string) =>
                  onUpdateSessionName(studySession.guid!, newValue)
                }></EditableTextbox>
            </SessionIcon>
          </Box>
          {numberOfSessions > 1 && (
            <IconButton
              className={classes.btnDeleteSession}
              onClick={e => {
                e.stopPropagation()
                //onRemoveSession(studySession.guid!)
                setIsConfirmDeleteOpen(true)
              }}>
              {' '}
              <ClearIcon fontSize="medium" />
            </IconButton>
          )}

          <SessionTimeDisplay assessments={studySession.assessments} />
        </Box>

        <DragDropContext
          onDragEnd={(dropResult: DropResult) => rearrangeAssessments(studySession.assessments, dropResult)}>
          <div className={classes.droppable}>
            <Droppable droppableId={studySession.guid + studySession.name} type="ASSESSMENT">
              {(provided, snapshot) => (
                <div
                  className={clsx({
                    dragging: snapshot.isDraggingOver,
                  })}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {!studySession.assessments ||
                    (studySession.assessments.length === 0 && (
                      <Box marginTop={7} padding={2}>
                        Add assessments and surveys to this session by clicking on the "+" below.{' '}
                      </Box>
                    ))}
                  {studySession.assessments?.map((assessment, index) => (
                    <Draggable draggableId={assessment.guid! + index} index={index} key={assessment.guid! + index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <AssessmentSmall assessment={assessment} isDragging={snapshot.isDragging}>
                            {isEditable && (
                              <Button
                                variant="text"
                                aria-label="delete assessment"
                                className={classes.btnDeleteAssessment}
                                onClick={e => {
                                  e.stopPropagation()
                                  removeAssessment(assessment.guid!)
                                }}>
                                <DeleteTwoToneIcon color="primary" />
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
        onClick={() => onSetActiveSession(studySession.guid!)}>
        {getInner(studySession, sessionIndex, numberOfSessions)}

        <Box className={classes.actions}>
          <FormControlLabel
            disabled={_.isEmpty(studySession.assessments)}
            control={
              <IconButton
                onClick={() => setIsEditable(!isEditable)}
                size="small"
                style={{padding: '0px', minWidth: 'auto', marginLeft: theme.spacing(1.5)}}>
                <EditTwoToneIcon
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {stroke: isEditable ? theme.palette.primary.main : 'auto'},
                  }}
                />
              </IconButton>
            }
            label=""
          />

          <Button onClick={() => onShowAssessments()} variant="text" style={{padding: '0px', minWidth: 'auto'}}>
            <AddIcon sx={{fontSize: '24px'}}></AddIcon>
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
          onRemoveSession(studySession.guid!)
        }}>
        <div>
          Are you sure you would like to permanently delete: <p>{studySession.name}</p>
        </div>
      </ConfirmationDialog>
    </>
  )
}

export default SingleSessionContainer
