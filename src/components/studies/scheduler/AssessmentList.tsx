import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
  Switch,
  Typography
} from '@material-ui/core'
import ClockIcon from '@material-ui/icons/AccessTime'
import clsx from 'clsx'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import { StudySession } from '../../../types/scheduling'
import { Assessment } from '../../../types/types'
import AssessmentSmall from '../../assessments/AssessmentSmall'
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
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

export interface AssessmentListProps {
  //use the following version instead if you need access to router props
  //export interface EndDateProps  extends  RouteComponentProps {
  //Enter your props here
  studySession: StudySession
  isGroupAssessments: boolean
  assessmentOrder: 'SEQUENTIAL' | 'RANDOM'
  onChangeGrouping: Function
  onSetRandomized: Function
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
  const totalTime = assessments.reduce(
    (prev, curr) => prev + Number(curr.duration),
    0,
  )
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
  assessmentOrder,
  isGroupAssessments,
  onChangeGrouping,
  onSetRandomized,
}: AssessmentListProps): JSX.Element => {
  const classes = useStyles()

  const getMargins = (
    index: number,
    assessmentsNumber: number,
  ): React.CSSProperties => {
    if (assessmentsNumber === 1) {
      return {}
    }
    const mTop = `${index === 0 ? 0 : -65 * 1}px`
    const mLeft = `${-10 * index + 50}px`
    return { marginLeft: mLeft, marginTop: mTop }
  }
  return (
    <>
      <SessionHeader
        order={studySession.order!}
        name={studySession.name}
        assessments={studySession.assessments}
      ></SessionHeader>

      <div
        className={clsx({
          [classes.inner]: true,
        })}
      >
        {studySession.assessments.map((assessment, index) => (
          <Box
            key={assessment.guid}
            style={
              assessmentOrder === 'RANDOM'
                ? getMargins(index, studySession.assessments.length)
                : {}
            }
          >
            <AssessmentSmall
              isHideDuration={assessmentOrder === 'RANDOM'}
              assessment={assessment}
              hasHover={false}
              isDragging={false}
            ></AssessmentSmall>
          </Box>
        ))}
      </div>
      {studySession.assessments.length > 1 && (
        <FormGroup aria-label="assessments" row style={{ marginLeft: '16px' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isGroupAssessments}
                onChange={e => onChangeGrouping(e.target.checked)}
              />
            }
            label="Bundle assessments"
          />

          <Typography component="div" style={{ marginLeft: '30px' }}>
            <Grid
              component="label"
              container
              alignItems="center"
              spacing={1}
              wrap="nowrap"
            >
              <Grid item>Sequential</Grid>
              <Grid item>
                <Switch
                  color="primary"
                  disabled={!isGroupAssessments}
                  checked={assessmentOrder === 'RANDOM'}
                  onChange={e => {
                    onSetRandomized(e.target.checked)
                  }}
                  name="checkedC"
                />
              </Grid>
              <Grid item>Randomized</Grid>
            </Grid>
          </Typography>
        </FormGroup>
      )}
    </>
  )
}

export default AssessmentList
