import { Box, FormControlLabel, FormGroup, makeStyles } from '@material-ui/core'
import ClockIcon from '@material-ui/icons/AccessTime'
import clsx from 'clsx'
import React from 'react'
import { latoFont, ThemeType } from '../../../style/theme'
import { PerformanceOrder, StudySession } from '../../../types/scheduling'
import { Assessment } from '../../../types/types'
import AssessmentSmall from '../../assessments/AssessmentSmall'
import SaveBlackBorderDropdown from '../../widgets/BlackBorderDropdown'
import SessionIcon from '../../widgets/SessionIcon'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',

    '&.active': {
      border: theme.activeBorder,
    },
  },
  inner: {
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    padding: theme.spacing(2),
  },
  order: {
    marginRight: '16px',
    marginTop: '16px',
    '& span': {
      fontSize: '11px',
      fontFamily: latoFont,
    },
  },
}))

export interface AssessmentListProps {
  studySessionIndex: number
  studySession: StudySession
  performanceOrder: PerformanceOrder
  onChangePerformanceOrder: (p: PerformanceOrder) => void
}

export interface SessionHeaderProps {
  order: number
  name: string
  assessments: Assessment[]
}
const SessionHeader: React.FunctionComponent<SessionHeaderProps> = ({
  order,
  name,
  assessments,
}: SessionHeaderProps) => {
  const totalTime = assessments.reduce((total, curr) => {
    const time = curr.minutesToComplete
    return total + (time ? time : 0)
  }, 0)

  const result = (
    <Box>
      <SessionIcon index={order}>
        <span>{name}</span>
      </SessionIcon>
      <Box textAlign="right" paddingBottom="16px">
        {totalTime} min &nbsp;&nbsp;
        <ClockIcon
          style={{ fontSize: '12px', verticalAlign: 'middle' }}
        ></ClockIcon>
      </Box>
    </Box>
  )
  return result
}

const AssessmentList: React.FunctionComponent<AssessmentListProps> = ({
  studySession,
  performanceOrder,
  onChangePerformanceOrder,
  studySessionIndex,
}: AssessmentListProps): JSX.Element => {
  const classes = useStyles()

  const [isGroupAssessments, setIsGroupAssessments] = React.useState(
    performanceOrder !== 'participant_choice',
  )

  const performanceOrderList = [
    { value: 'participant_choice', label: 'Participant Choice' },
    { value: 'sequential', label: 'Fixed Order' },
    { value: 'randomized', label: 'Random Order' },
  ]

  const getCardStyle = (
    index: number,
    assessmentsNumber: number,
  ): React.CSSProperties => {
    if (assessmentsNumber === 1) {
      return {}
    }
    const offsetUnit = -16 / assessmentsNumber
    const mTop = `${index === 0 ? 0 : -75 * 1}px`

    const mLeft = `${offsetUnit * index}px`
    const mRight = `${offsetUnit * (assessmentsNumber - index)}px`
    return {
      marginLeft: mLeft,
      marginRight: mRight,
      marginTop: mTop,
      boxShadow: '5px 5px 10px 0 rgb(0 0 0 / 10%)',
      width: '248px',
    }
  }
  return (
    <>
      <SessionHeader
        order={studySessionIndex}
        name={studySession.name}
        assessments={studySession.assessments || []}
      ></SessionHeader>

      <div
        className={clsx({
          [classes.inner]: true,
        })}
      >
        {studySession.assessments &&
          studySession.assessments.map((assessment, index) => (
            <Box
              key={studySession.guid! + assessment.guid + index}
              style={
                performanceOrder !== 'participant_choice'
                  ? getCardStyle(index, studySession.assessments?.length || 0)
                  : {}
              }
            >
              <AssessmentSmall
                isHideDuration={false /*performanceOrder === 'randomized'*/}
                assessment={assessment}
                hasHover={false}
                isDragging={false}
              ></AssessmentSmall>
            </Box>
          ))}
      </div>
      {studySession.assessments && studySession.assessments.length > 1 && (
        <FormGroup aria-label="assessments" row>
          <FormControlLabel
            labelPlacement="start"
            className={classes.order}
            control={
              <SaveBlackBorderDropdown
                width="150px"
                value={performanceOrder}
                onChange={e =>
                  onChangePerformanceOrder(e.target.value as PerformanceOrder)
                }
                emptyValueLabel="select"
                dropdown={performanceOrderList}
              />
            }
            label="Assessment Order:"
          />
        </FormGroup>
      )}
    </>
  )
}

export default AssessmentList
