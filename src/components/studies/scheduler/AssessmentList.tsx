import {
  FormControlLabel,
  Checkbox,
  makeStyles,
  Grid,
  Typography,
  Switch,
  Box,
  FormGroup,
} from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import { StudySession } from '../../../types/types'
import AssessmentSmall from '../../assessments/AssessmentSmall'

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
    paddingRight: theme.spacing(2)
    
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

const AssessmentList: React.FunctionComponent<AssessmentListProps> = ({
  studySession,
  assessmentOrder,
  isGroupAssessments,
  onChangeGrouping,
  onSetRandomized,
}: AssessmentListProps): JSX.Element => {
  const classes = useStyles()

  console.log(isGroupAssessments, 'ass')


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
      <span>{studySession.name}</span>-{' '}
      {studySession.assessments.reduce(
        (prev, curr) => prev + Number(curr.duration),
        0,
      )}{' '}
      min.
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
      <FormGroup aria-label="assessments" row style={{marginLeft: '16px'}}>
        <FormControlLabel
          control={
            <Checkbox
        
              checked = {isGroupAssessments}
              onChange={e =>
                onChangeGrouping(e.target.checked)
              }
            />
          }
          label="Bundle assessments"
        />

        <Typography component="div" style={{marginLeft: '30px'}}>
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
                disabled = {!isGroupAssessments}
                checked={assessmentOrder == 'RANDOM'}
                onChange={e => {
                  console.log('e' + e.target.checked)
                  onSetRandomized(e.target.checked)
                }}
                name="checkedC"
              />
            </Grid>
            <Grid item>Randomized</Grid>
          </Grid>
        </Typography>
      </FormGroup>
    </>
  )
}

export default AssessmentList
